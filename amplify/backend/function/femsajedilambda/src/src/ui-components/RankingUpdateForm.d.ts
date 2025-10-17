/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Ranking } from "../models";
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
export declare type RankingUpdateFormInputValues = {
    username?: string;
    password?: string;
    type?: string;
    grupo?: string;
    status?: boolean;
    nombre?: string;
    bookmark?: string;
    avatar?: number;
};
export declare type RankingUpdateFormValidationValues = {
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
export declare type RankingUpdateFormOverridesProps = {
    RankingUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    username?: PrimitiveOverrideProps<TextFieldProps>;
    password?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    grupo?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<SwitchFieldProps>;
    nombre?: PrimitiveOverrideProps<TextFieldProps>;
    bookmark?: PrimitiveOverrideProps<TextFieldProps>;
    avatar?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type RankingUpdateFormProps = React.PropsWithChildren<{
    overrides?: RankingUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    ranking?: Ranking;
    onSubmit?: (fields: RankingUpdateFormInputValues) => RankingUpdateFormInputValues;
    onSuccess?: (fields: RankingUpdateFormInputValues) => void;
    onError?: (fields: RankingUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: RankingUpdateFormInputValues) => RankingUpdateFormInputValues;
    onValidate?: RankingUpdateFormValidationValues;
} & React.CSSProperties>;
export default function RankingUpdateForm(props: RankingUpdateFormProps): React.ReactElement;
