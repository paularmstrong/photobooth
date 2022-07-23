import * as React from 'react';
import clsx from 'clsx';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  helpText?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  label: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChangeText?: (text: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  trailingIcon?: React.ReactNode;
  value?: string;
}

export function TextField({
  disabled = false,
  helpText,
  leadingIcon,
  label,
  onBlur,
  onChangeText,
  onFocus,
  trailingIcon,
  value: propValue = '',
  ...props
}: Props) {
  const [isFocused, setFocused] = React.useState(false);
  const [value, setValue] = React.useState(propValue);

  const handleFocus = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus && onFocus(event);
    },
    [onFocus]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur && onBlur(event);
    },
    [onBlur]
  );

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const { value } = event.target as HTMLInputElement;
      setValue(value);
      onChangeText && onChangeText(value);
    },
    [onChangeText, setValue]
  );

  React.useEffect(() => {
    if (propValue !== value) {
      setValue(propValue);
    }
  }, [propValue, setValue]);

  const labelMoved = isFocused || value !== '';

  return (
    <div className="w-full">
      <div
        className={clsx('bg-white rounded border-gray-400 border h-14 p-2 px-4 flex items-center justify-stretch', {
          'border-teal-600 ring-4 ring-teal-100 ring-opacity-30': isFocused,
          'opacity-70 cursor-not-allowed': disabled,
        })}
      >
        <label className="flex space-x-2 grow items-center">
          {leadingIcon ? <div className="w-6 h-full">{leadingIcon}</div> : null}

          <div className="flex items-center justify-items-stretch relative grow">
            <input
              className="h-8 mt-4 grow bg-transparent font-normal focus:outline-none focus:ring-0"
              disabled={disabled}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onInput={handleChange}
              tabIndex={0}
              value={value}
              {...props}
            />

            <div
              className={clsx('absolute top-3 bg-white rounded transition transition-all transform', {
                'text-xs font-medium -translate-y-2': labelMoved,
                'text-teal-700 font-medium': isFocused,
              })}
            >
              {label}
            </div>
          </div>

          {trailingIcon ? <div className="w-6 h-full">{trailingIcon}</div> : null}
        </label>
      </div>
      {helpText ? <div className="text-s pl-3 pt-1">{helpText}</div> : null}
    </div>
  );
}
