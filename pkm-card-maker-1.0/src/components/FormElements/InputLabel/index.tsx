import React from 'react';
import styles from '../Form.module.scss';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LabelButton {
  name: string,
  icon: IconDefinition,
  onClick: () => void,
}

interface Props {
  shortName: string,
  name?: string,
  horizontal?: boolean,
  buttons?: LabelButton[],
}

const InputLabel: React.FC<Props> = ({ shortName, name, horizontal, buttons, children }) =>
  <label htmlFor={shortName} className={`${styles.input} ${horizontal ? styles.horizontal : ''}`}>
    {name &&
      <div className={styles.inputLabel}>
        <span>{name}</span>
        {buttons &&
          <span>
            {buttons.map((button: LabelButton, i: number) =>
              <FontAwesomeIcon icon={button.icon} title={button.name} className={styles.inputLabelButton} key={i}
                onClick={(e) => {
                  e.preventDefault();
                  button.onClick();
                }}
              />
            )}
          </span>
        }
      </div>
    }
    {children}
  </label>

export default InputLabel;
