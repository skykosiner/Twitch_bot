import { SystemCommand } from "./cmd";

export type ValidationResult = {
    success: boolean;
    error?: string | null;
}

export type Validator = (data: SystemCommand) => ValidationResult;

const validators: Validator[] = [];

export function addValidator(validator: Validator): void {
    if (validators.includes(validator)) {
        return;
    }

    validators.push(validator);
}

export default function validate(data: SystemCommand): ValidationResult | null {
    let out: ValidationResult = null;

    for (let i = 0; (!out || out.success) && i < validators.length; ++i) {
        out = validators[i](data);
    }

    return out;
}
