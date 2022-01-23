import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { State } from 'reducers';
import { connect } from 'react-redux';
import { CardOptionsState } from 'reducers/cardOptions';
import { Variation, Type, Subtype, Set, Rarity, BaseSet, Rotation, RarityIcon, MoveType, Card, ImportedCard, ImportedMoveType } from 'interfaces';
import { bindActionCreators } from 'redux';
import { requestCardOptions } from 'actions';
import htmlToImage from 'html-to-image';
import download from 'downloadjs';
import styles from './CardCreator.module.scss';
import CardDisplay from 'components/CardDisplay';
import { Select, Input, Checkbox, ImageInput, EnergyPicker} from 'components/FormElements';
import { relativePathPrefix, cardToImportedCard, getCardImage } from 'services';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import getCroppedImg from 'cropImage';

interface Props {
  cardOptionsState: CardOptionsState,
  card?: ImportedCard,
  requestCardOptions: () => Object,
}

const CardCreatorPage: React.FC<Props> = ({ cardOptionsState, card, requestCardOptions }) => {
  const importingCard = useRef<boolean>(false);
  const initialImported = useRef<boolean>(false);
  const [importingTrigger, setImportingTrigger] = useState<boolean>(false);
  // Selectors
  const [supertype, setSupertype] = useState<string>('Pokemon');
  const [type, setType] = useState<Type>();
  const [baseSet, setBaseSet] = useState<BaseSet>();
  const [set, setSet] = useState<Set>();
  const [rotation, setRotation] = useState<Rotation>();
  const [variation, setVariation] = useState<Variation>();
  const [subtype, setSubtype] = useState<Subtype>();
  const [rarity, setRarity] = useState<Rarity>();
  const [rarityIcon, setRarityIcon] = useState<RarityIcon>();
  const [weaknessType, setWeaknessType] = useState<Type>();
  const [resistanceType, setResistanceType] = useState<Type>();
  // Selector refs
  const baseSetRef = useRef<HTMLSelectElement>(null);
  const supertypeRef = useRef<HTMLSelectElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const subtypeRef = useRef<HTMLSelectElement>(null);
  const variationRef = useRef<HTMLSelectElement>(null);
  const rarityRef = useRef<HTMLSelectElement>(null);
  const setIconRef = useRef<HTMLSelectElement>(null);
  const rotationRef = useRef<HTMLSelectElement>(null);
  const rarityIconRef = useRef<HTMLSelectElement>(null);
  const weaknessTypeRef = useRef<HTMLSelectElement>(null);
  const resistanceTypeRef = useRef<HTMLSelectElement>(null);
  // Inputs
  const [name, setName] = useState<string>('');
  const [prevolveName, setPrevolveName] = useState<string>('');
  const [hitpoints, setHitpoints] = useState<number>(100);
  const [subname, setSubname] = useState<string>('');
  const [pokedexEntry, setPokedexEntry] = useState<string>('');
  const [weaknessAmount, setWeaknessAmount] = useState<number>(2);
  const [resistanceAmount, setResistanceAmount] = useState<number>(30);
  const [retreatCost, setRetreatCost] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [illustrator, setIllustrator] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [totalInSet, setTotalInSet] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [imageLayer1, setImageLayer1] = useState<string>('');
  const [imageLayer2, setImageLayer2] = useState<string>('');
  const [typeImage, setTypeImage] = useState<string>('');
  const [prevolveImage, setPrevolveImage] = useState<string>('');
  const [hasCustomSetIcon, setHasCustomSetIcon] = useState<boolean>(false);
  const [customSetIcon, setCustomSetIcon] = useState<string>('');
  // Image cropper
  const [cropArea, setCropArea] = useState<Point>({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropImage, setCropImage] = useState<string>('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({ x: 0, y: 0, height: 0, width: 0 });
  const [currentCropSetter, setCurrentCropSetter] = useState<Dispatch<SetStateAction<string>>>();
  // Ability/Moves
  const [hasAbility, setHasAbility] = useState<boolean>(false);
  const [abilityName, setAbilityName] = useState<string>('');
  const [abilityText, setAbilityText] = useState<string>('');
  const [move1Name, setMove1Name] = useState<string>('');
  const [move1Damage, setMove1Damage] = useState<string>('');
  const [move1Text, setMove1Text] = useState<string>('');
  const [move1Cost, setMove1Cost] = useState<MoveType[]>([]);
  const [hasSecondMove, setHasSecondMove] = useState<boolean>(false);
  const [move2Name, setMove2Name] = useState<string>('');
  const [move2Text, setMove2Text] = useState<string>('');
  const [move2Damage, setMove2Damage] = useState<string>('');
  const [move2Cost, setMove2Cost] = useState<MoveType[]>([]);

  useEffect(() => {
    requestCardOptions();
  }, [requestCardOptions]);

  useEffect(() => {
    setType(cardOptionsState.cardOptions.types[0]);
    setWeaknessType(cardOptionsState.cardOptions.types[0]);
    setSet(cardOptionsState.cardOptions.sets[0]);
    setBaseSet(cardOptionsState.cardOptions.baseSets[0]);
    setSubtype(cardOptionsState.cardOptions.subtypes[0]);
    setRotation(cardOptionsState.cardOptions.rotations[0]);
  }, [cardOptionsState]);

  /**
   * Changes the types/subtypes etc to the first available one within their parent
   * For example, when Type is 'Item', and you switch Supertype to 'Pokemon', a Pokémon can't be an Item
   * so it switches to the first available Type within 'Pokemon', which is 'Grass'
   */
  useEffect(() => {
    if(importingCard.current) {
      return;
    }
    if(typeRef.current) {
      const { selectedIndex, options } = typeRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newType = cardOptionsState.cardOptions.types.find((a: Type) => a.id === +value);
      if(newType && newType !== type) {
        setType(newType);
      }
    } else {
      setType(undefined);
    }
    if(subtypeRef.current) {
      const { selectedIndex, options } = subtypeRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newSubtype = cardOptionsState.cardOptions.subtypes.find((a: Subtype) => a.id === +value);
      if(value === 'default' || (newSubtype && newSubtype !== subtype)) {
        setSubtype(newSubtype);
      }
    } else {
      setSubtype(undefined);
    }
    if(variationRef.current) {
      const { selectedIndex, options } = variationRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newVariation = cardOptionsState.cardOptions.variations.find((a: Variation) => a.id === +value);
      if(newVariation && newVariation !== variation) {
        setVariation(newVariation);
      }
    } else {
      setVariation(undefined);
    }
    if(rarityRef.current) {
      const { selectedIndex, options } = rarityRef.current;
      const value: string | undefined = options[selectedIndex]?.value;
      const newRarity = cardOptionsState.cardOptions.rarities.find((a: Rarity) => a.id === +value);
      if(value === 'default' || (newRarity && newRarity !== rarity)) {
        setRarity(newRarity);
      }
    } else {
      setRarity(undefined);
    }
  }, [cardOptionsState.cardOptions, supertype, type, subtype, variation, rarity]);

  /**
   * Turns state data into a Card object
   */
  const makeCard = (): Card => ({
    baseSet,
    supertype,
    type,
    set,
    customSetIcon: hasCustomSetIcon ? customSetIcon : undefined,
    variation,
    subtype,
    rarity,
    name,
    prevolveName,
    prevolveImage,
    hitpoints,
    subname,
    typeImage,
    pokedexEntry,
    ability: hasAbility ? {
      name: abilityName,
      text: abilityText,
    } : undefined,
    moves: [
      {
        name: move1Name,
        text: move1Text,
        damage: move1Damage,
        energyCost: move1Cost,
      },
      ...(!hasAbility && hasSecondMove ? [{
        name: move2Name,
        text: move2Text,
        damage: move2Damage,
        energyCost: move2Cost,
      }] : []),
    ],
    weaknessType,
    weaknessAmount,
    resistanceType,
    resistanceAmount,
    retreatCost,
    illustrator,
    cardNumber,
    totalInSet,
    rotation,
    rarityIcon,
    description,
    backgroundImage,
    imageLayer1,
    imageLayer2,
  });

  const downloadCard = () => {
    const card = document.getElementById('card');
    if(card) {
      htmlToImage.toPng(card)
        .then((dataUrl) => {
          download(dataUrl, `${name || 'card'}${subtype?.hasVSymbol ? ' V' : subtype?.hasVMaxSymbol ? ' VMAX' : ''}.png`);
        })
        .catch(console.error);
    }
  }

  const exportCard = () => {
    const card: Card = makeCard();
    const exportCard: ImportedCard = cardToImportedCard(card);
    navigator.clipboard.writeText(JSON.stringify(exportCard));
  }

  /**
   * Sets all card data, selectors and energy pickers to certain values based on the cardObj parameter
   */
  const importCard = (cardObj: ImportedCard) => {
    importingCard.current = true;
    // Base values
    setName(cardObj.name || '');
    setPrevolveName(cardObj.prevolveName || '');
    setPrevolveImage(relativePathPrefix(cardObj.prevolveImage || ''));
    setHitpoints(cardObj.hitpoints || 0);
    setSubname(cardObj.subname || '');
    setTypeImage(relativePathPrefix(cardObj.typeImage || ''));
    setPokedexEntry(cardObj.pokedexEntry || '');
    setWeaknessAmount(cardObj.weaknessAmount || 0);
    setResistanceAmount(cardObj.resistanceAmount || 0);
    setRetreatCost(cardObj.retreatCost || 0);
    setIllustrator(cardObj.illustrator || '');
    setCardNumber(cardObj.cardNumber || '');
    setTotalInSet(cardObj.totalInSet || '');
    setDescription(cardObj.description || '');
    setBackgroundImage(relativePathPrefix(cardObj.backgroundImage || ''));
    setImageLayer1(relativePathPrefix(cardObj.imageLayer1 || ''));
    setImageLayer2(relativePathPrefix(cardObj.imageLayer2 || ''));
    if(cardObj.customSetIcon) {
      setHasCustomSetIcon(true);
      setCustomSetIcon(cardObj.customSetIcon);
    }
    if(cardObj.ability) {
      setHasAbility(true);
      setAbilityName(cardObj.ability.name);
      setAbilityText(cardObj.ability.text);
    }
    if(cardObj.moves) {
      if(cardObj.moves[0]){
        setMove1Name(cardObj.moves[0].name);
        setMove1Damage(cardObj.moves[0].damage);
        setMove1Text(cardObj.moves[0].text);
        setMove1Cost(cardObj.moves[0].energyCost.reduce((result: MoveType[], moveType: ImportedMoveType) => {
          const newType: Type | undefined = cardOptionsState.cardOptions.types.find((a) => a.id === moveType.typeId);
          if(newType) {
            result.push({
              amount: moveType.amount,
              type: newType,
            });
          }
          return result;
        }, []));
      }
      if(cardObj.moves[1]) {
        setHasSecondMove(true);
        setMove2Name(cardObj.moves[1].name);
        setMove2Damage(cardObj.moves[1].damage);
        setMove2Text(cardObj.moves[1].text);
        setMove2Cost(cardObj.moves[1].energyCost.reduce((result: MoveType[], moveType: ImportedMoveType) => {
          const newType: Type | undefined = cardOptionsState.cardOptions.types.find((a) => a.id === moveType.typeId);
          if(newType) {
            result.push({
              amount: moveType.amount,
              type: newType,
            });
          }
          return result;
        }, []));
      }
    }
    // Selectors
    const newBaseSet: BaseSet | undefined = cardOptionsState.cardOptions.baseSets.find((a) => a.id === cardObj.baseSetId);
    if(newBaseSet) {
      setBaseSet(newBaseSet);
      if(baseSetRef.current && newBaseSet) {
        baseSetRef.current.selectedIndex = Array.from(baseSetRef.current.options).findIndex((t) => +t.value === newBaseSet.id);
      }
    } else {
      if(baseSetRef.current) {
        baseSetRef.current.selectedIndex = 0;
      }
      setBaseSet(undefined);
    }
    const newSupertype = cardObj.supertype;
    if(newSupertype) {
      setSupertype(newSupertype);
      if(supertypeRef.current) {
        supertypeRef.current.selectedIndex = Array.from(supertypeRef.current.options).findIndex((t) => t.value === newSupertype);
      }
    } else {
      if(supertypeRef.current) {
        supertypeRef.current.selectedIndex = 0;
      }
      setSupertype('Pokemon');
    }
    const newType: Type | undefined = cardOptionsState.cardOptions.types.find((a) => a.id === cardObj.typeId);
    if(newType) {
      setType(newType);
      if(typeRef.current) {
        typeRef.current.selectedIndex = Array.from(typeRef.current.options).findIndex((t) => +t.value === newType.id);
      }
    } else {
      if(typeRef.current) {
        typeRef.current.selectedIndex = 0;
      }
      setType(undefined);
    }
    if(cardObj.subtypeId) {
      const newSubtype: Subtype | undefined = cardOptionsState.cardOptions.subtypes.find((a) => a.id === cardObj.subtypeId);
      if(newSubtype) {
        setSubtype(newSubtype);
        if(subtypeRef.current) {
          subtypeRef.current.selectedIndex = Array.from(subtypeRef.current.options).findIndex((t) => +t.value === newSubtype.id);
        }
      }
    } else {
      if(subtypeRef.current) {
        subtypeRef.current.selectedIndex = 0;
      }
      setSubtype(undefined);
    }
    if(cardObj.setId) {
      const newSet: Set | undefined = cardOptionsState.cardOptions.sets.find((a) => a.id === cardObj.setId);
      if(newSet) {
        setSet(newSet);
        if(setIconRef.current) {
          setIconRef.current.selectedIndex = Array.from(setIconRef.current.options).findIndex((t) => +t.value === newSet.id);
        }
      }
    } else {
      if(setIconRef.current) {
        setIconRef.current.selectedIndex = 0;
      }
      setSet(undefined);
    }
    if(cardObj.weaknessTypeId) {
      const newWeaknessType: Type | undefined = cardOptionsState.cardOptions.types.find((a) => a.id === cardObj.weaknessTypeId);
      if(newWeaknessType) {
        setWeaknessType(newWeaknessType);
        if(weaknessTypeRef.current) {
          weaknessTypeRef.current.selectedIndex = Array.from(weaknessTypeRef.current.options).findIndex((t) => +t.value === newWeaknessType.id);
        }
      }
    } else {
      if(weaknessTypeRef.current) {
        weaknessTypeRef.current.selectedIndex = 0;
      }
      setWeaknessType(undefined);
    }
    if(cardObj.resistanceTypeId) {
      const newResistanceType: Type | undefined = cardOptionsState.cardOptions.types.find((a) => a.id === cardObj.resistanceTypeId);
      if(newResistanceType) {
        setResistanceType(newResistanceType);
        if(resistanceTypeRef.current) {
          resistanceTypeRef.current.selectedIndex = Array.from(resistanceTypeRef.current.options).findIndex((t) => +t.value === newResistanceType.id);
        }
      }
    } else {
      if(resistanceTypeRef.current) {
        resistanceTypeRef.current.selectedIndex = 0;
      }
      setResistanceType(undefined);
    }
    if(cardObj.rotationId) {
      const newRotation: Rotation | undefined = cardOptionsState.cardOptions.rotations.find((a) => a.id === cardObj.rotationId);
      if(newRotation) {
        setRotation(newRotation);
        if(rotationRef.current) {
          rotationRef.current.selectedIndex = Array.from(rotationRef.current.options).findIndex((t) => +t.value === newRotation.id);
        }
      }
    } else {
      if(rotationRef.current) {
        rotationRef.current.selectedIndex = 0;
      }
      setRotation(undefined);
    }
    if(cardObj.variationId) {
      const newVariation: Variation | undefined = cardOptionsState.cardOptions.variations.find((a) => a.id === cardObj.variationId);
      if(newVariation) {
        setVariation(newVariation);
        if(variationRef.current) {
          variationRef.current.selectedIndex = Array.from(variationRef.current.options).findIndex((t) => +t.value === newVariation.id);
        }
      }
    } else {
      if(variationRef.current) {
        variationRef.current.selectedIndex = 0;
      }
      setVariation(undefined);
    }
    if(cardObj.rarityId) {
      const newRarity: Rarity | undefined = cardOptionsState.cardOptions.rarities.find((a) => a.id === cardObj.rarityId);
      if(newRarity) {
        setRarity(newRarity);
        if(rarityRef.current) {
          rarityRef.current.selectedIndex = Array.from(rarityRef.current.options).findIndex((t) => +t.value === newRarity.id);
        }
      }
    } else {
      if(rarityRef.current) {
        rarityRef.current.selectedIndex = 0;
      }
      setRarity(undefined);
    }
    if(cardObj.rarityIconId) {
      const newRarityIcon: RarityIcon | undefined = cardOptionsState.cardOptions.rarityIcons.find((a) => a.id === cardObj.rarityIconId);
      if(newRarityIcon) {
        setRarityIcon(newRarityIcon);
        if(rarityIconRef.current) {
          rarityIconRef.current.selectedIndex = Array.from(rarityIconRef.current.options).findIndex((t) => +t.value === newRarityIcon.id);
        }
      }
    } else {
      if(rarityIconRef.current) {
        rarityIconRef.current.selectedIndex = 0;
      }
      setRarityIcon(undefined);
    }
    setImportingTrigger(!importingTrigger);
  }

  /**
   * Callback for the function above
   */
  useEffect(() => {
    importingCard.current = false;
  }, [importingTrigger]);

  useEffect(() => {
    // Initially import the prop-card once the selectors have loaded
    if(!initialImported.current && card && subtypeRef.current) {
      importCard(card);
      initialImported.current = true;
    }
  }, [card, importCard]);

  const resetCropper = (newImage: string, imageSetter: () => void) => {
    setCropImage(newImage);
    setCurrentCropSetter(imageSetter);
    setCropArea({ x: 0, y: 0});
    setCroppedAreaPixels({ ...croppedAreaPixels, x: 0, y: 0});
    setCropZoom(1);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <button className={styles.button} onClick={e => {
          navigator.clipboard.readText()
            .then((value: string) => {
              importCard(JSON.parse(value) as ImportedCard);
            })
            .catch(console.error);
        }}>{'Import from clipboard'}</button>
        <div className={styles.seperator}>
          <Select name='Base Set' shortName='baseSet' selectRef={baseSetRef} onChange={e => setBaseSet(cardOptionsState.cardOptions.baseSets.find((a: BaseSet) => a.id === +e.currentTarget.value))}>
            {cardOptionsState.cardOptions.baseSets.map((value: BaseSet, i: number) =>
              <option value={value.id} key={i}>{value.name}</option>
            )}
          </Select>
          <Select name='Supertype' shortName='supertype' selectRef={supertypeRef} onChange={e => setSupertype(e.currentTarget.value)}>
            <option value={'Pokemon'}>{'Pokémon'}</option>
            <option value={'Trainer'}>{'Trainer'}</option>
            <option value={'Energy'}>{'Energy'}</option>
          </Select>
          <Select name='Type' shortName='type' selectRef={typeRef} onChange={e => setType(cardOptionsState.cardOptions.types.find((a: Type) => a.id === +e.currentTarget.value))}>
            {cardOptionsState.cardOptions.types.map((value: Type, i: number) => {
              if(supertype !== value.supertype) {
                return false;
              } else {
                return <option value={value.id} key={i}>{value.name}</option>;
              }
            })}
          </Select>
          {type?.hasSubtypes && supertype !== 'Energy' &&
            <Select name='Subtype' shortName='subtype' selectRef={subtypeRef} onChange={e => setSubtype(cardOptionsState.cardOptions.subtypes.find((a: Subtype) => a.id === +e.currentTarget.value))}>
              {type?.subtypeOptional && <option value={'default'}>{'Default'}</option>}
              {cardOptionsState.cardOptions.subtypes.map((value: Subtype, i: number) => {
                if(!value.types.includes(type?.id || 0)) {
                  return false;
                } else {
                  return <option value={value.id} key={i}>{value.name}</option>;
                }
              })}
            </Select>
          }
          {subtype?.hasVariations && supertype !== 'Energy' && supertype !== 'Trainer' &&
            <Select name='Variation' shortName='variation' selectRef={variationRef} onChange={e => setVariation(cardOptionsState.cardOptions.variations.find((a: Variation) => a.id === +e.currentTarget.value))}>
              {cardOptionsState.cardOptions.variations.map((value: Variation, i: number) => {
                if(!value.subtypes.includes(subtype?.id || 0)) {
                  return false;
                } else {
                  return <option value={value.id} key={i}>{value.name}</option>;
                }
              })}
            </Select>
          }
          {supertype !== 'Energy' && supertype !== 'Trainer' && (type?.rarities[0] || subtype?.rarities[0] || variation?.rarities[0]) &&
            <Select name='Rarity' shortName='rarity' selectRef={rarityRef} onChange={e => setRarity(cardOptionsState.cardOptions.rarities.find((a: Rarity) => a.id === +e.currentTarget.value))}>
              <option value={'default'}>{'Default'}</option>
              {cardOptionsState.cardOptions.rarities.map((value: Rarity, i: number) => {
                const includesType: boolean = type?.rarities.includes(value.id) || false;
                const includesSubtype: boolean = subtype?.rarities.includes(value.id) || false;
                const includesVariation: boolean = variation?.rarities.includes(value.id) || false;
                if((includesType && (includesSubtype || !subtype) && (includesVariation || !variation))
                  || (includesSubtype && (includesVariation || !variation))
                  || includesVariation) {
                  return <option value={value.id} key={i}>{value.name}</option>;
                } else {
                  return false;
                }
              })}
            </Select>
          }
          {!(supertype === 'Energy' && type?.shortName !== 'Special') && <>
            <Select name='Rotation' shortName='rotation' selectRef={rotationRef} onChange={e => setRotation(cardOptionsState.cardOptions.rotations.find((a: Rotation) => a.id === +e.currentTarget.value))}>
              {cardOptionsState.cardOptions.rotations.map((value: Rotation, i: number) =>
                <option value={value.id} key={i}>{value.name}</option>
              )}
            </Select>
            <Select name='Rarity Icons' shortName='rarityIcon' selectRef={rarityIconRef} onChange={e => setRarityIcon(cardOptionsState.cardOptions.rarityIcons.find((a: RarityIcon) => a.id === +e.currentTarget.value))}>
              <option value={'none'}>{'None'}</option>
              {cardOptionsState.cardOptions.rarityIcons.map((value: RarityIcon, i: number) =>
                <option value={value.id} key={i}>{value.name}</option>
              )}
            </Select>
            <Checkbox name='Custom Set Icon' shortName='customSetIcon' checked={hasCustomSetIcon} setter={setHasCustomSetIcon} />
            {hasCustomSetIcon ?
              <ImageInput shortName='customSetIcon' setter={setCustomSetIcon} />
              :
              <Select name='Set Icon' shortName='set' selectRef={setIconRef} onChange={e => setSet(cardOptionsState.cardOptions.sets.find((a: Set) => a.id === +e.currentTarget.value))}>
                {cardOptionsState.cardOptions.sets.map((value: Set, i: number) =>
                  <option value={value.id} key={i}>{value.name}</option>
                )}
              </Select>
            }
          </>}
        </div>
        {!(supertype === 'Energy' && type?.shortName !== 'Special') && <>
          <div className={styles.seperator}>
            <Input type='text' name='Name' shortName='name' value={name} setter={setName} />
            {supertype === 'Pokemon' &&
              <Input type='number' name='Hitpoints' shortName='hitpoints' value={hitpoints} setter={setHitpoints} min={0} max={999} />
            }
            {subtype?.hasPrevolve && <>
              <Input type='text' name='Prevolve Name' shortName='prevolveName' value={prevolveName} setter={setPrevolveName} />
              <ImageInput name='Prevolve Image' shortName='prevolveImage' setter={setPrevolveImage} />
            </>}
            {subtype?.hasPokedexEntry &&
              <Input type='text' horizontal name='Pokédex Entry' shortName='pokedexEntry' value={pokedexEntry} setter={setPokedexEntry} />
            }
            {type?.hasSubname &&
              <Input type='text' name='Subname' shortName='subname' value={subname} setter={setSubname} />
            }
          </div>
          {supertype === 'Pokemon' && <>
            <div className={styles.seperator}>
              <Checkbox name='Has Ability' shortName='hasAbility' checked={hasAbility} setter={setHasAbility} />
              {hasAbility && <>
                <Input type='text' name='Ability Name' shortName='abilityName' value={abilityName} setter={setAbilityName} />
                <Input type='textarea' name='Ability Text' shortName='abilityText' value={abilityText} setter={setAbilityText} />
              </>}
            </div>
            <div className={styles.seperator}>
              <Input type='text' name='Move Name' shortName='move1Name' value={move1Name} setter={setMove1Name} />
              <Input type='text' name='Move Damage' shortName='move1Damage' value={move1Damage} setter={setMove1Damage} />
              <Input type='textarea' horizontal name='Move Text' shortName='move1Text' value={move1Text} setter={setMove1Text} />
              <EnergyPicker label={'Move Cost'} types={cardOptionsState.cardOptions.types} moveCost={move1Cost} setMoveCost={setMove1Cost} />
            </div>
            {!hasAbility &&
              <div className={styles.seperator}>
                <Checkbox name='Has Second Move' shortName='hasSecondMove' checked={hasSecondMove} setter={setHasSecondMove} />
                {hasSecondMove && <>
                  <Input type='text' name='Move Name' shortName='move2Name' value={move2Name} setter={setMove2Name} />
                  <Input type='text' name='Move Damage' shortName='move2Damage' value={move2Damage} setter={setMove2Damage} />
                  <Input type='textarea' name='Move Text' shortName='move2Text' value={move2Text} setter={setMove2Text} />
                  <EnergyPicker label={'Move Cost'} types={cardOptionsState.cardOptions.types} moveCost={move2Cost} setMoveCost={setMove2Cost} />
                </>}
              </div>
            }
            <div className={styles.seperator}>
              <Select name='Weakness Type' shortName='weaknessType' selectRef={weaknessTypeRef} onChange={e => setWeaknessType(cardOptionsState.cardOptions.types.find((a: Type) => a.id === +e.currentTarget.value))}>
                {cardOptionsState.cardOptions.types.map((value: Type, i: number) => {
                  if(supertype !== value.supertype) {
                    return false;
                  } else {
                    return <option disabled={supertype !== value.supertype} value={value.id} key={i}>{value.name}</option>;
                  }
                })}
              </Select>
              <Input type='number' name='Weakness Amount' shortName='weaknessAmount' value={weaknessAmount} setter={setWeaknessAmount} max={99} min={0} />
              <Select name='Resistance Type' shortName='resistanceType' selectRef={resistanceTypeRef} onChange={e => setResistanceType(cardOptionsState.cardOptions.types.find((a: Type) => a.id === +e.currentTarget.value))}>
                <option value={'none'}>{'None'}</option>
                {cardOptionsState.cardOptions.types.map((value: Type, i: number) => {
                  if(supertype !== value.supertype) {
                    return false;
                  } else {
                    return <option disabled={supertype !== value.supertype} value={value.id} key={i}>{value.name}</option>;
                  }
                })}
              </Select>
              {resistanceType &&
                <Input type='number' name='Resistance Amount' shortName='resistanceAmount' value={resistanceAmount} setter={setResistanceAmount} max={99} min={0} />
              }
              <Input type='number' name='Retreat Cost' shortName='retreatCost' value={retreatCost} setter={setRetreatCost} max={5} min={0} />
            </div>
          </>}
          {!subtype?.noDescription &&
            <div className={styles.seperator}>
              <Input type='textarea' name='Description' shortName='description' value={description} setter={setDescription} />
            </div>
          }
          <div className={styles.seperator}>
            {supertype !== 'Energy' &&
              <Input type='text' name='Illustrator' shortName='illustrator' value={illustrator} setter={setIllustrator} />
            }
            <Input type='text' name='Card Number' shortName='cardNumber' value={cardNumber} setter={setCardNumber} />
            <Input type='text' name='Total In Set' shortName='totalInSet' value={totalInSet} setter={setTotalInSet} />
          </div>
        </>}
        <div className={styles.seperator}>
          <span className={styles.info}>{'Card dimensions are 747w × 1038h'}</span>
          {currentCropSetter &&
            <>
              <div className={styles.cropperWrapper}>
                <Cropper
                  image={cropImage}
                  crop={cropArea}
                  zoom={cropZoom}
                  cropSize={{ width: 320, height: 444.66 }} // Based on aspect ratio
                  maxZoom={100}
                  minZoom={.1}
                  restrictPosition={false}
                  zoomSpeed={.1}
                  aspect={747 / 1038}
                  onCropChange={(location: Point) => setCropArea(location)}
                  onCropComplete={async (croppedArea: Area, cap: Area) => setCroppedAreaPixels(cap)}
                  onZoomChange={(newZoom: number) => setCropZoom(newZoom)}
                />
                <img alt='' src={getCardImage({baseSet: baseSet?.shortName, type: type?.shortName, rarity: rarity?.shortName, subtype: subtype?.shortName, supertype: supertype, variation: variation?.shortName})} className={styles.cropperImage} />
              </div>
              <button className={styles.button} onClick={async () => {
                const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels);
                currentCropSetter && currentCropSetter(croppedImage);
              }}>
                {'Apply crop'}
              </button>
            </>
          }
          <ImageInput name='Background Image' shortName='backgroundImage' info='Placed behind everything'
            setter={setBackgroundImage}
            croppable cropperSetter={resetCropper}
          />
          <ImageInput name='Card Image' shortName='imageLayer1' info='Placed in front of background'
            setter={setImageLayer1}
            croppable cropperSetter={resetCropper}
          />
          <ImageInput name='Top Image' shortName='imageLayer2' info='Placed on top of the card image'
            setter={setImageLayer2}
            croppable cropperSetter={resetCropper}
          />
          {supertype === 'Energy' &&
            <ImageInput name='Type Image' shortName='typeImage' info="The energy's top right icon" setter={setTypeImage} />
          }
        </div>
        <button className={styles.button} onClick={downloadCard}>{'Download as image'}</button>
        <button className={styles.button} onClick={exportCard}>{'Export to clipboard'}</button>
      </div>
      <div className={styles.cardWrapper}>
        <CardDisplay card={makeCard()} />
        <div id='imagePreview' className={styles.cardImagePreview}></div>
      </div>
    </div>
  )
}

const mapStateToProps = (state: State) => ({ cardOptionsState: state.cardOptions });
const mapDispatchToProps = (dispatch: any) => bindActionCreators({ requestCardOptions }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CardCreatorPage);
