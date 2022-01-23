import React from 'react';
import styles from '../Form.module.scss';
import InputLabel from '../InputLabel';

interface Props {
  shortName: string,
  name: string,
  value: string | number,
  type: 'text' | 'number' | 'textarea',
  min?: number,
  max?: number,
  horizontal?: boolean,
  setter: (newValue: any) => void,
}

const Input: React.FC<Props> = ({ shortName, name, value, type, min, max, setter, horizontal }) =>
  <InputLabel shortName={shortName} name={name} horizontal={horizontal || type === 'textarea'}>
    {type !== 'textarea' ?
      <input
        id={shortName}
        name={shortName}
        value={value}
        type={type}
        min={min}
        max={max}
        onChange={e => setter(type === 'text' ? e.currentTarget.value : +e.currentTarget.value)}
        className={styles.inputField}
      />
      :
      <textarea
        id={shortName}
        name={shortName}
        value={value}
        onChange={e => setter(e.currentTarget.value)}
        className={`${styles.inputField} ${styles.inputTextarea}`}
      ></textarea>
    }
  </InputLabel>

export default Input;
