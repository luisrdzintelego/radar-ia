import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerRanking = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Ranking, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username?: string | null;
  readonly password?: string | null;
  readonly type?: string | null;
  readonly grupo?: string | null;
  readonly status?: boolean | null;
  readonly nombre?: string | null;
  readonly bookmark?: string | null;
  readonly avatar?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRanking = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Ranking, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly username?: string | null;
  readonly password?: string | null;
  readonly type?: string | null;
  readonly grupo?: string | null;
  readonly status?: boolean | null;
  readonly nombre?: string | null;
  readonly bookmark?: string | null;
  readonly avatar?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Ranking = LazyLoading extends LazyLoadingDisabled ? EagerRanking : LazyRanking

export declare const Ranking: (new (init: ModelInit<Ranking>) => Ranking) & {
  copyOf(source: Ranking, mutator: (draft: MutableModel<Ranking>) => MutableModel<Ranking> | void): Ranking;
}