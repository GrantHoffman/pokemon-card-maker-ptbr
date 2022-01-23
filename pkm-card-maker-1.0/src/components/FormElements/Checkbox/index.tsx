import React from 'react';
import styles from '../Form.module.scss';
import InputLabel from '../InputLabel';

interface Props {
  shortName: string,
  name: string,
  checked: boolean,
  setter: (newValue: boolean) => void,
}

const Checkbox: React.FC<Props> = ({ shortName, name, checked, setter }) =>
  <InputLabel shortName={shortName} name={name}>
      <input
        id={shortName}
        name={shortName}
        checked={checked}
        onChange={e => setter(e.currentTarget.checked)}
        className={styles.inputField}
        type='checkbox'
      />
  </InputLabel>

export default Checkbox;
