# Redux Pokémon Card Maker
## Installation
Requirements:
- Node >= 8.10

Setup:
- `npm i`

Run:
- `npm start`

Deploy to GitHub Pages:
- `npm run deploy`

## Cardname formatting
This formatting is based on the Sword & Shield naming system

_*Required_
### Pokemon
| Set code* | Subtype | Variation | Rarity | Type* | Outcome |
|-----------|-----------|--------|-------|-------|---------|
| SS | V | | FA | Psychic | SS_V_FA_Psychic |
| SS | VMax | Gigantamax | Rainbow | Psychic |SS_VMax_Rainbow_Gigantamax_Psychic |
| SS | Stage1 | | | Dark | SS_Stage1_Dark |

### Trainers
| Set code* | Supertype* | Type* | Subtype | Outcome |
|-----------|----------|-------|-----------|---------|
| SS | Trainer | Item | Tool | SS_Trainer_Item_Tool |
| SS | Trainer | Supporter | | SS_Trainer_Supporter |

### Energy
| Set code* | Supertype* | Type* | Outcome |
|-----------|---------|-------|---------|
| SS | Energy | Base | SS_Energy_Base |
| SS | Energy | Special | SS_Energy_Special |
