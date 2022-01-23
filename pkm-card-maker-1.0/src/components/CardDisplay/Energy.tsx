import React from 'react';
import { Type } from 'interfaces';
import styles from './CardDisplay.module.scss';
import { formatText } from './index';

interface Props {
  name?: string,
  description?: string,
  type?: Type,
  typeImage?: string,
}

const EnergyCard: React.FC<Props> = ({ name, description, type, typeImage }) => <>
  {type?.hasSpecialStyle && <>
    <span className={styles.name}>{formatText(name)}</span>
    <div className={`${styles.descriptionWrapper} ${styles.descriptionWrapperEnergy}`}>
      <p className={styles.description}>{formatText(description)}</p>
    </div>
  </>}
  {typeImage &&
    <img src={typeImage} className={`${styles.typeImage} ${type?.shortName === 'Special' ? styles.typeImageSpecial : ''}`} alt='' />
  }
</>

export default EnergyCard;
