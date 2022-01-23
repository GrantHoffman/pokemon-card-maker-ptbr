import React, { ChangeEvent } from 'react';
import styles from '../Form.module.scss';
import InputLabel from '../InputLabel';

interface Props {
  shortName: string,
  name: string,
  selectRef?: React.RefObject<HTMLSelectElement>,
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
}

const Select: React.FC<Props> = ({ shortName, name, selectRef, onChange, children }) =>
  <InputLabel shortName={shortName} name={name}>
    <select id={shortName} ref={selectRef} name={shortName} className={styles.inputField} onChange={onChange}>
      {children}
    </select>
  </InputLabel>

export default Select;
