import { ImportedCard, Card, Move, MoveType, ImagePathOptions } from 'interfaces';

export const relativePathPrefix = (path: string): string  => `${process.env.REACT_APP_RELATIVE_PREFIX || ''}${path}`;

export const cardToImportedCard = (card: Card): ImportedCard => ({
  supertype: card.supertype,
  name: card.name,
  subname: card.subname,
  backgroundImage: card.backgroundImage,
  imageLayer1: card.imageLayer1,
  imageLayer2: card.imageLayer2,
  typeImage: card.typeImage,
  customSetIcon: card.customSetIcon,
  cardNumber: card.cardNumber,
  totalInSet: card.totalInSet,
  hitpoints: card.hitpoints,
  illustrator: card.illustrator,
  weaknessAmount: card.weaknessAmount,
  resistanceAmount: card.resistanceAmount,
  retreatCost: card.retreatCost,
  ability: card.ability,
  prevolveName: card.prevolveName,
  prevolveImage: card.prevolveImage,
  pokedexEntry: card.pokedexEntry,
  description: card.description,
  baseSetId: card.baseSet?.id,
  setId: card.set?.id,
  typeId: card.type?.id,
  weaknessTypeId: card.weaknessType?.id,
  resistanceTypeId: card.resistanceType?.id,
  subtypeId: card.subtype?.id,
  rarityId: card.rarity?.id,
  variationId: card.variation?.id,
  rotationId: card.rotation?.id,
  rarityIconId: card.rarityIcon?.id,
  moves: card.moves?.map((move: Move) => ({
    name: move.name,
    damage: move.damage,
    text: move.text,
    energyCost: move.energyCost.map((moveType: MoveType) => ({
      amount: moveType.amount,
      typeId: moveType.type.id,
    })),
  })),
});

const cardOptionsToImage = (options: ImagePathOptions, folder?: string, supertype?: string) => {
  // Format the options according to the formatting defined in the README
  let filePath: string = relativePathPrefix(`/assets/${options.supertype || supertype}/`);
  if(folder) {
    filePath += `${folder}/`;
  }
  Object.values(options).forEach((param: string, i: number) => {
    if(param !== undefined && param !== 'default') {
      if((param === 'Dynamax' && options.rarity === 'Rainbow') ||
        (param === 'Gigantamax' && options.rarity === 'Rainbow') ||
        (options.rarity === 'Promo' && param === 'Basic')) {
        return;
      }
      if(i !== 0) {
        filePath += '_';
      }
      filePath += param;
      if(param === 'Rainbow') {
        if(options.variation === 'Dynamax' || options.variation === 'Gigantamax') {
          filePath += `_${options.variation}`;
        }
      }
      if(param === 'V' && !options.rarity) {
        filePath += '_Basic';
      }
    }
  });
  return `${filePath}.png`;
}

export const getCardImage = (options: ImagePathOptions): string => {
  let imagePath: string;
  switch(options.supertype) {
    case 'Pokemon':
      // This one didnt have supertype before
      imagePath = cardOptionsToImage({ baseSet: options.baseSet, subtype: options.subtype, variation: options.variation,
        rarity: options.rarity, type: options.type }, options.type, options.supertype);
      break;
    case 'Energy':
      imagePath = cardOptionsToImage({ baseSet: options.baseSet, supertype: options.supertype, type: options.type });
      break;
    case 'Trainer':
      imagePath = cardOptionsToImage({ baseSet: options.baseSet, supertype: options.supertype, type: options.type, subtype: options.subtype });
      break;
    default:
      imagePath = '';
  }
  return imagePath;
}
