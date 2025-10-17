/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type RankingCreateFormInputValues = {
    username?: string;
    password?: string;
    type?: string;
    grupo?: string;
    status?: boolean;
    nombre?: string;
    bookmark?: string;
    avatar?: number;
};
export declare type RankingCreateFormValidationValues = {
    username?: ValidationFunction<string>;
    password?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    grupo?: ValidationFunction<string>;
    status?: ValidationFunction<boolean>;
    nombre?: ValidationFunction<string>;
    bookmark?: ValidationFunction<string>;
    avatar?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type RankingCreateFormOverridesProps = {
    RankingCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
    password?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    grupo?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<SwitchFieldProps>;
    nombre?: PrimitiveOverrideProps<TextFieldProps>;
    bookmark?: PrimitiveOverrideProps<TextFieldProps>;
    avatar?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RankingCreateFormProps = React.PropsWithChildren<{
    overrides?: RankingCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: RankingCreateFormInputValues) => RankingCreateFormInputValues;
    onSuccess?: (fields: RankingCreateFormInputValues) => void;
    onError?: (fields: RankingCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RankingCreateFormInputValues) => RankingCreateFormInputValues;
    onValidate?: RankingCreateFormValidationValues;
} & React.CSSProperties>;
export default function RankingCreateForm(props: RankingCreateFormProps): React.ReactElement;
