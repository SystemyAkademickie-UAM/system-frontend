import { useMemo } from 'react';
import CharacterLimitedField from '../CharacterCounter/CharacterLimitedField.jsx';
import { TEXT_FIELD_PRESETS } from '../../../constants/fieldLimits.js';
import { validateWholeNumberInput } from '../../../utils/validation/rewardsNumericValidation.js';
import './TextField.css';

/**
 * @typedef {'name' | 'stageName' | 'shortDescription' | 'groupDescription' | 'postContent' | 'postTitle'} TextFieldPreset
 */

/**
 * @param {Object} props
 * @param {string} [props.id]
 * @param {string} [props.label]
 * @param {string | number} props.value
 * @param {(event: import('react').ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} props.onChange
 * @param {TextFieldPreset} [props.fieldKind]
 * @param {boolean} [props.multiline]
 * @param {number} [props.rows]
 * @param {number} [props.maxLength]
 * @param {'text' | 'password' | 'number'} [props.type='text']
 * @param {string} [props.error]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 * @param {string} [props.inputClassName]
 * @param {boolean} [props.required]
 * @param {(event: import('react').KeyboardEvent) => void} [props.onKeyDown]
 */
export default function TextField({
  id,
  label,
  value,
  onChange,
  fieldKind,
  multiline: multilineProp,
  rows: rowsProp,
  maxLength: maxLengthProp,
  type = 'text',
  error,
  placeholder,
  disabled = false,
  className = '',
  inputClassName = '',
  required = false,
  onKeyDown,
}) {
  const preset = fieldKind ? TEXT_FIELD_PRESETS[fieldKind] : null;
  const multiline = multilineProp ?? preset?.multiline ?? false;
  const rows = rowsProp ?? preset?.rows ?? 4;
  const maxLength = maxLengthProp ?? preset?.maxLength;

  const numberValidation = useMemo(() => {
    if (type !== 'number') {
      return { valid: true, error: null };
    }
    return validateWholeNumberInput(String(value ?? ''));
  }, [type, value]);

  const resolvedError = error ?? (type === 'number' && String(value ?? '').trim() !== '' && !numberValidation.valid
    ? numberValidation.error
    : null);

  const controlClassName = [
    'maq-text-field__control',
    multiline ? 'maq-text-field__control--textarea' : '',
    resolvedError ? 'maq-text-field__control--error' : '',
    inputClassName,
  ].filter(Boolean).join(' ');

  const controlProps = {
    id,
    value: value ?? '',
    onChange,
    className: controlClassName,
    placeholder,
    disabled,
    required,
    'aria-invalid': resolvedError ? true : undefined,
    'aria-describedby': resolvedError && id ? `${id}-error` : undefined,
    onKeyDown,
  };

  const control = multiline ? (
    <textarea
      {...controlProps}
      rows={rows}
      maxLength={maxLength}
    />
  ) : (
    <input
      {...controlProps}
      type={type === 'number' ? 'text' : type}
      inputMode={type === 'number' ? 'numeric' : undefined}
      maxLength={maxLength}
    />
  );

  return (
    <div className={['maq-text-field', className].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={id} className="maq-text-field__label">
          {label}
        </label>
      ) : null}
      {maxLength ? (
        <CharacterLimitedField value={value ?? ''} maxLength={maxLength}>
          {control}
        </CharacterLimitedField>
      ) : (
        control
      )}
      {resolvedError ? (
        <p id={id ? `${id}-error` : undefined} className="maq-text-field__error" role="alert">
          {resolvedError}
        </p>
      ) : null}
    </div>
  );
}
