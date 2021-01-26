import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { MyContext } from '../context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  URL: string;
  EmailAddress: any;
  JSON: any;
  JSONObject: any;
  PhoneNumber: any;
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['Boolean']>;
  me?: Maybe<User>;
  users: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _dummy?: Maybe<Scalars['Boolean']>;
  appleSignIn?: Maybe<User>;
  appleSignUp?: Maybe<User>;
  googleSignIn?: Maybe<User>;
  googleSignUp?: Maybe<User>;
  signIn?: Maybe<User>;
  signUp?: Maybe<User>;
};

export type MutationAppleSignInArgs = {
  token: Scalars['String'];
};

export type MutationAppleSignUpArgs = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  token: Scalars['String'];
};

export type MutationGoogleSignInArgs = {
  id: Scalars['String'];
  email: Scalars['String'];
  fullName: Scalars['String'];
  imageURL: Scalars['String'];
};

export type MutationGoogleSignUpArgs = {
  id: Scalars['String'];
  email: Scalars['String'];
  fullName: Scalars['String'];
  imageURL: Scalars['String'];
};

export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type MutationSignUpArgs = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirm: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  _dummy?: Maybe<Scalars['Boolean']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['EmailAddress'];
  picture: Scalars['URL'];
};

export type AppleUser = {
  __typename?: 'AppleUser';
  iss?: Maybe<Scalars['String']>;
  sub?: Maybe<Scalars['String']>;
  aud?: Maybe<Scalars['String']>;
  iat?: Maybe<Scalars['String']>;
  exp?: Maybe<Scalars['String']>;
  none?: Maybe<Scalars['String']>;
  nonce_supported?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['EmailAddress']>;
  email_verified?: Maybe<Scalars['String']>;
  is_private_email?: Maybe<Scalars['String']>;
  real_user_status?: Maybe<Scalars['Int']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  URL: ResolverTypeWrapper<Scalars['URL']>;
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  PhoneNumber: ResolverTypeWrapper<Scalars['PhoneNumber']>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<import('../database/db').User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  AppleUser: ResolverTypeWrapper<AppleUser>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  DateTime: Scalars['DateTime'];
  URL: Scalars['URL'];
  EmailAddress: Scalars['EmailAddress'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  PhoneNumber: Scalars['PhoneNumber'];
  Query: {};
  Boolean: Scalars['Boolean'];
  Mutation: {};
  String: Scalars['String'];
  Subscription: {};
  User: import('../database/db').User;
  ID: Scalars['ID'];
  AppleUser: AppleUser;
  Int: Scalars['Int'];
}>;

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export interface PhoneNumberScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PhoneNumber'], any> {
  name: 'PhoneNumber';
}

export type QueryResolvers<
  ContextType = MyContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  _dummy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = MyContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  _dummy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  appleSignIn?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationAppleSignInArgs, 'token'>
  >;
  appleSignUp?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationAppleSignUpArgs, 'firstName' | 'lastName' | 'email' | 'token'>
  >;
  googleSignIn?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationGoogleSignInArgs, 'id' | 'email' | 'fullName' | 'imageURL'>
  >;
  googleSignUp?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationGoogleSignUpArgs, 'id' | 'email' | 'fullName' | 'imageURL'>
  >;
  signIn?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationSignInArgs, 'email' | 'password'>
  >;
  signUp?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationSignUpArgs, 'name' | 'email' | 'password' | 'passwordConfirm'>
  >;
}>;

export type SubscriptionResolvers<
  ContextType = MyContext,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = ResolversObject<{
  _dummy?: SubscriptionResolver<
    Maybe<ResolversTypes['Boolean']>,
    '_dummy',
    ParentType,
    ContextType
  >;
}>;

export type UserResolvers<
  ContextType = MyContext,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>;
  picture?: Resolver<ResolversTypes['URL'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AppleUserResolvers<
  ContextType = MyContext,
  ParentType extends ResolversParentTypes['AppleUser'] = ResolversParentTypes['AppleUser']
> = ResolversObject<{
  iss?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sub?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  aud?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  iat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  none?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  nonce_supported?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['EmailAddress']>, ParentType, ContextType>;
  email_verified?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  is_private_email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  real_user_status?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MyContext> = ResolversObject<{
  DateTime?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  PhoneNumber?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  AppleUser?: AppleUserResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MyContext> = Resolvers<ContextType>;
