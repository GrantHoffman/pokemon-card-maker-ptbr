import React, { useEffect, useState } from 'react';
import { Card } from 'interfaces';
import TrainerCard from './Trainer';
import styles from './CardDisplay.module.scss';
import EnergyCard from './Energy';
import PokemonCard from './Pokemon';
import { relativePathPrefix, getCardImage } from 'services';

interface Props {
  card: Card,
}

const CardDisplay: React.FC<Props> = ({ card }) => {
  const [imagePath, setImagePath] = useState<string>();
  const { supertype, type, baseSet, set, variation, subtype, rarity } = card;

  useEffect(() => {
    if(supertype && type && baseSet) {
      const newImage: string = getCardImage({baseSet: baseSet.shortName, type: type.shortName, rarity: rarity?.shortName, subtype: subtype?.shortName, supertype: supertype, variation: variation?.shortName})
      setImagePath(newImage);
    }
  }, [supertype, type, baseSet, set, variation, subtype, rarity]);

  return (
    <div className={`${styles.card} ${card.type?.hasWhiteText ? styles.whiteText : ''}`} id='card'>
      {card.backgroundImage && <img src={card.backgroundImage} className={styles.backgroundImage} alt='' />}
      {supertype === 'Trainer' && <TrainerCard name={card.name} subname={card.subname} description={card.description} type={card.type} />}
      {supertype === 'Energy' && <EnergyCard name={card.name} description={card.description} type={card.type} typeImage={card.typeImage} />}
      {supertype === 'Pokemon' && <PokemonCard card={card} />}
      {!(supertype === 'Energy' && card.type?.hasSpecialStyle) && <>
        <div className={card.rarity?.hasNameOutline || card.subtype?.hasNameOutline ? styles.cardInfoWhite : ''}>
          {(supertype !== 'Energy' && card.illustrator) && <span className={styles.illustrator}>{`Illus. ${card.illustrator}`}</span>}
          {card.customSetIcon ?
            <img src={card.customSetIcon} alt='' className={styles.setIcon} />
            :
            card.set && <img src={relativePathPrefix(`/assets/icons_symbols/sets/${card.set.number}_SetIcon_${card.set.shortName}.png`)} alt={card.set.name} className={styles.setIcon} />
          }
          {card.rotation && <img src={relativePathPrefix(`/assets/icons_symbols/rotations/${card.rotation?.shortName}.png`)} alt={card.rotation?.name} className={styles.rotation} />}
          <span className={styles.setNumber}>
            {`${card.cardNumber || ''}${card.totalInSet ? `/${card.totalInSet}` : ''}`}
            {card.rarityIcon &&
              <img alt={card.rarityIcon.name} className={styles.rarityIcon}
                src={relativePathPrefix(`/assets/icons_symbols/rarities/${card.rarityIcon.shortName}${(card.type?.hasWhiteText || card.subtype?.hasVStyle) ? '_white' : ''}.png`)}
              />
            }
          </span>
        </div>
      </>}
      {card.imageLayer1 && <img src={card.imageLayer1} className={styles.imageLayer1} alt='' />}
      <img src={imagePath} className={styles.image} alt={card.name || ''} />
      {card.imageLayer2 && <img src={card.imageLayer2} className={styles.imageLayer2} alt='' />}
    </div>
  )
}

export default CardDisplay;

export const formatText = (text: string | undefined) => {
  if(text) {
    let chars: RegExpMatchArray | null = text.match(/\[.*?\]/g);
    if(chars) {
      const charsArr: string[] = chars.map(char => char.replace('[', '').replace(']', ''));
      const textNoChars = text.split(/\[.*?\]/g);
      const returnText: (JSX.Element | string)[] = [];
      textNoChars.forEach((textElm, i) => {
        returnText.push(textElm);
        if(charsArr.length > i) {
          if(charsArr[i].length > 1) {
            returnText.push(<span key={i} className={styles.italicText}>{charsArr[i]}</span>);
          } else {
            returnText.push(<span key={i} className={styles.ptcgText}>{charsArr[i]}</span>);
          }
        }
      });
      return returnText;
    } else {
      return text;
    }
  } else {
    return false;
  }
}
