const HelpComponents = ( function() { // eslint-disable-line no-unused-vars

  /**
   * V Theme Module for help components
   *
   */

  'use strict';

  V.setStyle( {
'help-overlay__content': {
  'overflow-y': 'scroll',
  'height': '62vh',
},
'help-overlay__content p': {
  'margin-bottom': '1rem',
}
      } );

  /* ============== user interface strings ============== */

  const ui = ( () => {
    const strings = {

    };

    if ( V.getSetting( 'devMode' ) ) {
      VTranslation.setStringsToTranslate( strings );
    }

    return strings;
  } )();

  /* ================== event handlers ================== */


  /* ================  public components ================ */

function homePage() {
  return V.cN({
  c: 'help-overlay__content',
  h: [
    {
      t: 'p',
      h: 'HUMBILKA berechnet Humusbilanzen auf Grundlage einer kombinierten Modellierung der C- und N-Flüsse im System Boden-Pflanze. Details zum verwendeten Modell gibt es hier.',
    },
    {
      t: 'p',
      h: 'Humusbilanzen ermitteln die Versorgung von Ackerböden mit organischer Substanz. Grundsätzlich gilt bei Bilanzen und Modellen, dass diese eine Einschätzung der realen Bedingungen darstellen und keine Messung! Es kann dabei grundsätzlich zu Fehleinschätzungen kommen, wenn das Modell am konkreten Standort wirkende Faktoren nicht oder nicht hinreichend genau abbilden kann. Die Interpretation eines Modellergebnisses erfordert daher grundsätzlich Fachwissen, um dessen Plausibilität zu beurteilen!',
    },
    {
      t: 'p',
      c: 'font-bold',
      h: 'Oberes Menü',
    },
    {
      t: 'p',
      h: 'Neben dem Login und den App-Einstellungen, sowie der Hilfe- und Suchfunktion werden im oberen Menü nach Anmeldung Ihr Profilzugang und eine Liste der von Ihnen zuletzt besuchten Einträge dargestellt. Die App-Einstellungen lassen sich durch das Klicken auf die Personen-Siluette öffnen und schließen.',
    },
    {
      t: 'p',
      c: 'font-bold',
      h: 'Unteres Menü',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Foyer',
    },
    {
      t: 'p',
      h: 'Das Foyer ist unsere Willkommensseite. Hier finden Sie allgemeine Informationen zu HUMBILKA.',
    },
    {
      t: 'p',
      h: 'Im unteren Menü finden Sie die Hauptfunktionen der HUMBILKA App. Derzeit sind dies das Anlegen von Schlägen und Gruppen, sowie das Einsehen des Foyer und der Medieninhalte.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Schläge',
    },
    {
      t: 'p',
      h: 'Humusbilanzen werden am besten für einzelne Flächen über mehrere Jahre berechnet. Hierfür können im Menü „Schläge“ Flächen angelegt oder bestehende Flächen angesehen und bearbeitet werden. Flächenbezogene Humusbilanzen geben das rechnerische Verhältnis von Abbau und Nachlieferung organischer Substanz im Boden an und zeigen so, ob ein Potential für den Aufbau der Humusvorräte und eine damit verbundene Steigerung der Produktivität der Fläche besteht, oder ob die Bodenqualität durch eine unzureichende Versorgung beeinträchtigt wird.',
    },
    {
      t: 'p',
      h: 'Angelegte Schläge werden automatisch im Nutzer*innenprofil gespeichert und stehen beim nächsten Login wieder zur Verfügung.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Gruppen',
    },
    {
      t: 'p',
      h: 'Für eine flächenübergreifende Auswertung – z.B. auf Betriebsebene – können im Menü „Gruppen“ Flächen zusammengefasst werden.',
    },
    {
      t: 'p',
      h: 'Achtung: Eine flächenübergreifende Auswertung zeigt den Mittelwert der Flächen in dieser Gruppe und gibt damit eine Information zum allgemeinen Potential der Gruppe in der Versorgung der Böden mit organischer Substanz. Ein ausgeglichener Mittelwert kann dabei auch durch Flächen mit stark überhöhter und Flächen mit unzureichender Versorgung mit organischer Substanz bedingt sein – es ist daher immer sinnvoll, auch die Bilanzen der einzelnen Flächen im Blick zu haben, da nur hier konkreter Handlungsbedarf erkannt werden kann.',
    },
    {
      t: 'p',
      h: 'Angelegte Gruppen werden automatisch im Nutzer*innenprofil gespeichert und stehen beim nächsten Login wieder zur Verfügung.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Medien',
    },
    {
      t: 'p',
      h: 'Im Menü „Medien“ stehen Informationen zum Modell und zu organischer Substanz im Boden zur Verfügung.',
    },
  ]
});

}

function singlePlot() {
return V.cN({
  c: 'help-overlay__content',
  h: [
    {
      t: 'p',
      h: 'Für die Berechnung der Humusbilanz müssen alle Haupt- und Zwischenfrüchte im Bewertungszeitraum in ihrer zeitlichen Abfolge einzeln angegeben werden (eine Fruchtart je Registerkarte). Darüber hinaus sind Angaben zur Düngung und zu ausgewählten Standortbedingungen notwendig.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Fruchtart',
    },
    {
      t: 'p',
      h: 'Bitte Fruchtart auswählen. Falls eine Fruchtart nicht in der Liste verfügbar ist, kann eine physiologisch möglichst ähnliche Kultur ausgewählt werden. Das Bilanzergebnis wird dadurch allerdings unsicherer.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Düngung',
    },
    {
      t: 'p',
      h: 'Es können bis zu fünf Dünger angegeben werden. Hierfür öffnet sich jeweils nach Eingabe eines Düngers ein neues Feld für die Eingabe eines weiteren Düngers. Mehrere Gaben des gleichen Düngertyps können in einem Düngeereignis zusammengefasst werden, wenn insgesamt mehr als fünf Düngeereignisse auf der Fläche stattfanden, oder wenn nur Gesamtmengen dokumentiert sind.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Haupt- und Nebenprodukt',
    },
    {
      t: 'p',
      h: 'Als Hauptprodukt gilt das eigentliche Ernteprodukt (Getreidekorn, Kartoffelknollen, Rübenkörper usw.). Nebenprodukte sind fakultative Ernteprodukte (Stroh, Kartoffelkraut, Rübenblatt usw.). Futterpflanzen und andere ganz geerntete Pflanzen sowie Gründüngungspflanzen haben kein Nebenprodukt.',
    },
    {
      t: 'p',
      h: 'Werden für Haupt- und/oder Nebenprodukt keine Erträge angegeben, verwendet das Modell Standardwerte. Diese können in den Modellparametern eingesehen werden.',
    },
    {
      t: 'p',
      h: 'Bei Ernte der ganzen Pflanze bzw. von Haupt- und Nebenprodukt muss jeweils die Ernte mit „ja“ bestätigt werden. Verbleibt das Nebenprodukt auf der Fläche, wird hier die Ernte auf „nein“ gestellt. Verbleibt eine Kultur komplett als Gründüngung auf dem Feld, wird bei der Ernte des Hauptproduktes „nein“ angegeben. In diesem Fall wird die Ernte des Nebenproduktes automatisch ebenfalls auf „nein“ eingestellt.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Sonderfall Kleegras, Luzernegras und Ackergras',
    },
    {
      t: 'p',
      h: 'Bei mehrfach geernteten oder gemulchten Beständen muss die Anzahl der Schnitte/Mulchgänge angegeben werden (Option erscheint bei den Fruchtarten Futterleguminosen und Ackergras automatisch). Als Erntedatum ist hier das Datum des letzten Schnittes anzugeben.',
    },
    {
      t: 'p',
      h: '„Umbruch“ bezeichnet das Datum der Bodenbearbeitung oder anderer Maßnahmen zur Terminierung des Pflanzenbestandes (auch in umbruchsfreien Verfahren, z.B. Anwendung der Messerwalze in stehenden Beständen bei Mulchsaat).',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Bilanzkennzahlen',
    },
    {
      t: 'p',
      h: 'Die einzelnen Parameter der Bilanz werden in der Modellbeschreibung erläutert. Unter „C Humusbilanz“ und „N Humusbilanz“ wird die Bilanz der Kultur in kg C bzw. kg N je ha im Anbauzeitraum angegeben. C und N liegen dabei gebunden in der organischen Substanz vor und drücken den kalkulierten Aufbau neuer organischer Bodensubstanz aus. Die N-bezogene Humusbilanz gibt damit im Gegensatz zur N-bezogenen Düngerbilanz.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Schlagdaten',
    },
    {
      t: 'p',
      h: 'Schlagdaten sollten sich grundsätzlich auf repräsentative Flächen im Schlag beziehen.',
    },
    {
      t: 'p',
      h: 'Die Angabe des mittleren C:N-Verhältnisses im Oberboden verbessert die Qualität des Modellergebnisses, ist aber nicht obligatorisch. Wird kein Wert angegeben, verwendet das Modell ein Verhältnis von 10:1 als Standard.',
    },
    {
      t: 'p',
      h: 'Die Angabe der Bodenart im Oberboden ist obligatorisch.',
    },
    {
      t: 'p',
      h: 'Die Angabe des mittleren Jahreniederschlages ist nur notwendig, wenn keine Wetterstation in der Nähe erkannt wird und entsprechend keine Daten automatisch abgerufen werden können.',
    },
    {
      t: 'p',
      h: 'Zur atmosphärischen N-Deposition liegen in der Regel keine Daten vor. Das Modell nimmt daher 20 kg N je ha und Jahr als Standardwert an. Sollte jedoch ein spezifischer Wert für den Standort vorliegen, können dieser hier eingetragen werden.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Gruppierung',
    },
    {
      t: 'p',
      h: 'Sofern Gruppen angelegt wurden, denen der Schlag zugeordnet ist, werden diese hier angezeigt.',
    }
  ]
});

}

function groups() {
  return V.cN({
  c: 'help-overlay__content',
  h: [
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Flächengruppierung',
    },
    {
      t: 'p',
      h: 'Hier können Flächen gruppiert werden, um mittlere Bilanzen für die entsprechende Gruppe anzuzeigen. Die Funktion ermöglicht so z.B. eine Auswertung auf Betriebs- oder Gemarkungsebene. Die Bezeichnung der Gruppen ist frei wählbar. Nach Anlage der Gruppe werden dieser bereits angelegte Schläge zugeordnet. Einzelne Flächen (Schläge) können dabei auch mehreren Gruppen zugeordnet werden.',
    },
    {
      t: 'p',
      c: 'txt-italic',
      h: 'Bewertungshilfe zur Humusbilanz auf Gruppenebene',
    },
    {
      t: 'p',
      h: 'Humusbilanzen für mehrere Schläge oder für einen Gesamtbetrieb zeigen ein mittleres Versorgungsniveau mit organischer Substanz an. Damit kann beurteilt werden, ob in der Gruppe insgesamt ausreichend Potential für den Erhalt oder Aufbau der Humusvorräte besteht.',
    },
    {
      t: 'p',
      h: 'Als Entscheidungshilfe für die konkrete Bewirtschaftung der Ackerflächen sind nur Humusbilanzen auf Schlag-Ebene geeignet, da sich in der Gruppenbilanz stark negative und stark positive Flächenbilanzen ausgleichen können und Handlungsbedarf verdecken!',
    },
    {
      t: 'p',
      h: 'Grundsätzlich sind Humusbilanzen Expert*innen-Instrumente. Anwender*innen müssen in der Lage sein, die Plausibilität von Bilanzergebnissen kritisch zu beurteilen!',
    }
  ]
});


}

  /* ====================== export ====================== */

  return {
    homePage,
    singlePlot,
    groups,
  }

} )();
