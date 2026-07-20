import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ageConsistencyValidator(control: AbstractControl): ValidationErrors | null {
  const birth = control.get('birthDate')?.value;
  const age = control.get('age')?.value;

  if (!birth || !age) return null;

  const birthDate = new Date(birth);
  const today = new Date();
  
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }

  if (calculatedAge !== Number(age)) {
    return { ageMismatch: true }; 
  }

  return null;
}