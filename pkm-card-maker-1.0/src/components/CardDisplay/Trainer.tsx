import React from 'react';
import { Type } from 'interfaces';
import styles from './CardDisplay.module.scss';
import { formatText } from './index';

interface Props {
  name?: string,
  description?: string,
  type?: Type,
  subname?: string,
}

const TrainerCard: React.FC<Props> = ({ name, description, type, subname }) => <>
  <span className={styles.name}>{formatText(name)}</span>
  <div className={styles.descriptionWrapper}>
    <p className={styles.description}>{formatText(description)}</p>
  </div>
  {type?.hasSubname && <span className={styles.subname}>{formatText(subname)}</span>}
</>

export default TrainerCard;
