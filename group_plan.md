
I found one important implementation detail: if you add a compact role code for Group, existing holderOf checks must use V.castRole(item.c) rather than comparing item.c directly to "Group". Otherwise new groups will be created but won’t show up in the user’s group list.


## Goal
Add first-class “network/community groups” to `v-alpha`, separate from the existing plot-group workflow.
The repo already has partial group support in `web-interface/app/plugins/src/group/`, but it is currently plot/farm-oriented. We should make `Group` a real entity role, let users create Group profiles, list groups at `/groups`, and store group membership in the existing `servicefields.s30` field.

## 1. Add `Group` as a frontend role
In `web-interface/app/vcore/src/helper/v-helper.js`, extend `castRole()`:
```js
case 'Group' : return 'aq';
case 'aq' : return 'Group';
Place it after the existing Plot mapping.

Important: after this, stored group entities will have roleCode: 'aq' and role: 'Group'.

##2. Keep servicefield mapping
This already exists and can be reused:

case 'groupedEntities': return 's30';
Membership should be stored as a JSON string of entity UUIDs:

group.servicefields[V.castServiceField('groupedEntities')]
Example value:

'["abc1234567","def1234567"]'

##3. Fix group lookups in GroupComponents
Anywhere group ownership is detected, do not compare raw role codes to "Group".

Change this pattern:

.filter( item => item.c === 'Group' )
to:

.filter( item => V.castRole( item.c ) === 'Group' )
This matters because new groups will store item.c as 'aq'.

4. Change group creation to use the normal profile flow
In web-interface/app/plugins/src/group/group.js, use join flow 5 instead of 6.

set6 currently includes joinSelectGroups, which is plot-specific. For network/community groups, use set5: title, description, location, image, create.

use: {
  form: 'new entity',
  privacy: 2,
  join: 5,
  role: 'Group',
},

5. Replace /groups listing behavior
Group.draw() currently calls Marketplace.draw(path). For first-class groups, make /groups query only group entities.

Suggested shape:

function draw( path ) {
  preview( path );
  V.getQuery( {
    query: '',
    role: 'Group',
  } ).then( res => {
    if ( !res.success || !res.data || !res.data.length ) {
      Page.draw( {
        topcontent: CanvasComponents.notFound( 'group' ),
      } );
      return;
    }
    const list = CanvasComponents.list();
    res.data.forEach( group => {
      V.setNode( list, [
        UserComponents.entityListCard( group ),
      ] );
    } );
    Page.draw( {
      listings: list,
    } );
    VMap.draw( res.data );
  } );
}
This uses the existing V.getQuery() path, which filters by role through the Firebase namespace API.

6. Programmatic group creation helper
If you need a direct API-style helper, create the group first, then write membership to servicefields.s30.

async function createGroup( {
  title,
  description,
  privacy = 2,
  memberUuids = [],
} ) {
  const created = await V.setEntity( {
    role: 'Group',
    title,
    description,
    privacy,
  } );
  if ( !created.success ) {
    throw new Error( created.status || 'Could not create group' );
  }
  const group = created.data[0];
  if ( memberUuids.length ) {
    const field = V.castServiceField( 'groupedEntities' );
    await V.setEntity( group.fullId, {
      field: `servicefields.${field}`,
      data: V.castJson( [ ...new Set( memberUuids ) ] ),
      activeProfile: group.uuidP,
    } );
    group.servicefields[field] = V.castJson( memberUuids );
  }
  document.dispatchEvent(
    new CustomEvent( 'ENTITY_CREATED', {
      detail: { entity: group },
    } ),
  );
  return group;
}

7. Backend role validation note
graphql-firebase-entity-store/functions/resolvers/validate/role.js is currently stale and not called for server-side entity creation. If role validation is re-enabled, update it to accept compact role codes, not human names.

For example, include:

'aq'
for Group, plus the existing compact codes like aa, ab, etc.

8. Test/checklist
Before shipping:

Add a small test or console verification that V.castRole('Group') === 'aq' and V.castRole('aq') === 'Group'.
Create a group through /groups.
Confirm the created entity has role: 'Group' and roleCode: 'aq'.
Confirm it appears in /groups.
Confirm a group profile page renders normally.
Confirm adding members writes UUIDs into servicefields.s30.
Confirm existing plot-group widgets still work.