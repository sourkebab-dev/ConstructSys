import { computed, ref, type Ref } from "vue";

type Validator = (value: any) => string;

interface FormState {
  isDirty: boolean;
  isValid: boolean;
  errorMessage: string;
  trigger: () => void;
}

type Validations<T> = {
  formState: FormState;
} & Partial<Record<keyof T, FormState>>;

interface Config<T> {
  formData: Ref<T>;
  rules: Partial<Record<keyof T, Array<Validator>>>
}

type DirtyFields<T> = Partial<Record<keyof T, boolean>>;

export default function useValidation<T>({ formData, rules }: Config<T>) {

  const ruleskey = Object.keys(rules) as Array<keyof T>;

  const defaultDirty = ruleskey.reduce<Partial<Record<keyof T, boolean>>>((acc, key) => {
    acc[key] = false;
    return acc;
  }, {});

  const formDirty = ref<DirtyFields<T>>(defaultDirty);

  const validations = computed<Validations<T>>(() => {
    const fieldValidations: Partial<Record<keyof T, FormState>> = {};
    const entries = Object.entries(rules) as Array<[keyof T, Validator[]]>;

    let isAnyDirty = false;
    let isEveryValid = true;

    entries.forEach((entry) => {
      const [key, validators] = entry;
      let errorMessage = '';

      const hasError = validators.some((validatorFunc) => {
        errorMessage = validatorFunc(formData.value[key]);
        return errorMessage;
      });

      const field = formDirty.value as DirtyFields<T>;
      const isDirty = field[key] || false;

      if (isDirty) isAnyDirty = true;
      if (hasError) isEveryValid = false;

      fieldValidations[key] = {
        isDirty,
        isValid: !hasError,
        errorMessage: isDirty ? errorMessage : "",
        trigger: () => { field[key] = true }
      }
    });



    return {
      formState: {
        isDirty: isAnyDirty,
        errorMessage: isAnyDirty && !isEveryValid ? 'Error' : '',
        isValid: isEveryValid,
        trigger: () => { (Object.values(fieldValidations)).forEach(value => (value as FormState).trigger()) },
      },
      ...fieldValidations,
    }
  });

  return {
    validations,
  }
}