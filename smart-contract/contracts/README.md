ShareTokenGame creates a standalone token:
- contribute(amount, parts) : will sub a total amount from sender's balance and randomly create numbers based on the number parts . for example, if we divide 100 token into 5 parts. This will create 5 random numbers.(x1...x5)
- withdraw(): receiver will get one random number and calcul the proposition amoung the other random numbers. as amount contributed: y, random number x1, the amount withdrew will be: y * x1 / (x1+x2+x3+x4+x5).

The game is over when the tokens contributed are totally withdrown.
