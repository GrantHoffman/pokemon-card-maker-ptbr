import React, { useState, useEffect } from 'react';
import styles from './EnergyPicker.module.scss';
import { MoveType, Type } from 'interfaces';
import { relativePathPrefix } from 'services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

interface Props {
  label: String,
  types: Type[],
  moveCost: MoveType[],
  setMoveCost: (moveTypes: MoveType[]) => void,
}

const EnergyPicker: React.FC<Props> = ({ label, types, moveCost, setMoveCost }) => {
  let [moveTypes, setMoveTypes] = useState<MoveType[]>([]);

  useEffect(() => {
    const newMoveTypes: MoveType[] = [];
    types.forEach((type) => {
      if(type.supertype === 'Pokemon') {
        newMoveTypes.push({
          type,
          amount: 0,
        });
      }
    });
    setMoveTypes(newMoveTypes);
  }, [types]);

  return (
    <div>
      <span>{label}</span>
      <div className={styles.wrapper}>
        {moveTypes.map((moveType, i) =>
          <div className={styles.type} key={i}>
            <span className={styles.button} onClick={() => {
              let newMoveCost: MoveType[] = [...moveCost];
              let type: MoveType | undefined = newMoveCost.find((a) => a.type.id === moveType.type.id);
              if(type) {
                type.amount = type.amount + 1;
              } else {
                type = {
                  type: moveType.type,
                  amount: 1,
                };
                newMoveCost.push(type);
              }
              setMoveCost(newMoveCost);
            }}>
              <FontAwesomeIcon icon={faChevronUp} />
            </span>
            <img src={relativePathPrefix(`/assets/icons_symbols/types/${moveType.type.shortName}_border.png`)} className={styles.image} alt={moveType.type.name} title={moveType.type.name} />
            <span className={styles.button} onClick={() => {
              let newMoveCost: MoveType[] = [...moveCost];
              let type: MoveType | undefined = newMoveCost.find((a) => a.type.id === moveType.type.id);
              if(type) {
                type.amount = type.amount - 1;
                if(type.amount <= 0) {
                  newMoveCost.splice(newMoveCost.indexOf(type), 1)
                }
                setMoveCost(newMoveCost);
              }
            }}>
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
            <span>{moveCost.find((a) => a.type.id === moveType.type.id)?.amount || 0}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EnergyPicker;
