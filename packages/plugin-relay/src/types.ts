import { GraphQLResolveInfo } from 'graphql';
import {
  EmptyToOptional,
  FieldKind,
  FieldNullability,
  FieldOptionsFromKind,
  FieldRequiredness,
  InputFieldMap,
  InputFieldRef,
  InputRef,
  InputShape,
  InputShapeFromFields,
  inputShapeKey,
  InterfaceParam,
  MaybePromise,
  Normalize,
  ObjectFieldsShape,
  ObjectParam,
  ObjectRef,
  ObjectTypeOptions,
  OutputRef,
  OutputRefShape,
  OutputShape,
  OutputType,
  ParentShape,
  Resolver,
  SchemaTypes,
  ShapeFromListTypeParam,
  ShapeFromTypeParam,
} from '@pothos/core';

export type RelayPluginOptions<Types extends SchemaTypes> = EmptyToOptional<{
  edgesNullable?: FieldNullability<[unknown]>;
  nodeNullable?: boolean;
  clientMutationId?: 'omit' | 'optional' | 'required';
  cursorType?: 'ID' | 'String';
  nodeTypeOptions: Omit<PothosSchemaTypes.ObjectTypeOptions<Types, unknown>, 'fields'>;
  pageInfoTypeOptions: Omit<PothosSchemaTypes.ObjectTypeOptions<Types, PageInfoShape>, 'fields'>;
  nodeQueryOptions: Omit<
    PothosSchemaTypes.QueryFieldOptions<
      Types,
      OutputRefShape<GlobalIDShape<Types> | string>,
      true,
      { id: InputFieldRef<InputShape<Types, 'ID'>> },
      Promise<unknown>
    >,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  nodesQueryOptions: Omit<
    PothosSchemaTypes.QueryFieldOptions<
      Types,
      [OutputRefShape<GlobalIDShape<Types> | string>],
      true,
      { ids: InputFieldRef<InputShape<Types, 'ID'>[]> },
      Promise<unknown>[]
    >,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  mutationInputArgOptions: Omit<
    PothosSchemaTypes.ArgFieldOptions<Types, InputRef<{}>, true>,
    'fields' | 'required' | 'type'
  >;
  clientMutationIdInputOptions: Omit<
    PothosSchemaTypes.InputObjectFieldOptions<Types, 'ID', true>,
    'required' | 'type'
  >;
  clientMutationIdFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<
      Types,
      {},
      'ID',
      false,
      {},
      Types['Scalars']['ID']['Output']
    >,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  cursorFieldOptions: Normalize<
    Omit<
      PothosSchemaTypes.ObjectFieldOptions<
        Types,
        {},
        'ID' | 'String',
        false,
        {},
        Types['Scalars']['ID' | 'String']['Output']
      >,
      'args' | 'nullable' | 'resolve' | 'type'
    > & {
      type?: 'ID' | 'String';
    }
  >;
  nodeFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<
      Types,
      {},
      ObjectRef<{}>,
      false,
      {},
      GlobalIDShape<Types> | string
    >,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  edgesFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<Types, {}, [ObjectRef<{}>], false, {}, unknown[]>,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  pageInfoFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<
      Types,
      {},
      OutputRef<PageInfoShape>,
      false,
      {},
      PageInfoShape
    >,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  hasNextPageFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<Types, PageInfoShape, 'Boolean', false, {}, boolean>,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  hasPreviousPageFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<Types, PageInfoShape, 'Boolean', false, {}, boolean>,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  startCursorFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<
      Types,
      PageInfoShape,
      'ID' | 'String',
      false,
      {},
      string | null
    >,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  endCursorFieldOptions: Omit<
    PothosSchemaTypes.ObjectFieldOptions<
      Types,
      PageInfoShape,
      'ID' | 'String',
      false,
      {},
      string | null
    >,
    'args' | 'nullable' | 'resolve' | 'type'
  >;
  beforeArgOptions: Omit<
    PothosSchemaTypes.InputObjectFieldOptions<Types, 'ID' | 'String', false>,
    'required' | 'type'
  >;
  afterArgOptions: Omit<
    PothosSchemaTypes.InputObjectFieldOptions<Types, 'ID' | 'String', false>,
    'required' | 'type'
  >;
  firstArgOptions: Omit<
    PothosSchemaTypes.InputObjectFieldOptions<Types, 'Int', false>,
    'required' | 'type'
  >;
  lastArgOptions: Omit<
    PothosSchemaTypes.InputObjectFieldOptions<Types, 'Int', false>,
    'required' | 'type'
  >;
  encodeGlobalID?: (typename: string, id: bigint | number | string) => string;
  decodeGlobalID?: (globalID: string) => {
    typename: string;
    id: string;
  };
}>;

export interface DefaultEdgesNullability {
  // TODO(breaking) according to the spec, this should be nullable
  list: false;
  items: true;
}

export interface PageInfoShape {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export interface GlobalIDShape<Types extends SchemaTypes> {
  id: OutputShape<Types, 'ID'>;
  type: OutputType<Types> | string;
}

export type ConnectionShape<
  Types extends SchemaTypes,
  T,
  Nullable,
  EdgesNullable extends FieldNullability<[unknown]> = Types['DefaultEdgesNullability'],
  NodeNullable extends boolean = Types['DefaultNodeNullability'],
> =
  | (Nullable extends false ? never : null | undefined)
  | (Types['Connection'] & {
      pageInfo: PageInfoShape;
      edges: ShapeFromListTypeParam<
        Types,
        [
          ObjectRef<{
            cursor: string;
            node: NodeNullable extends false ? T : T | null | undefined;
          }>,
        ],
        EdgesNullable
      >;
    });

export type ConnectionShapeFromBaseShape<
  Types extends SchemaTypes,
  Shape,
  Nullable extends boolean,
> = ConnectionShape<Types, Shape, Nullable>;

export type ConnectionShapeForType<
  Types extends SchemaTypes,
  Type extends OutputType<Types>,
  Nullable extends boolean,
  EdgeNullability extends FieldNullability<[unknown]>,
  NodeNullability extends boolean,
> = ConnectionShape<
  Types,
  ShapeFromTypeParam<Types, Type, false>,
  Nullable,
  EdgeNullability,
  NodeNullability
>;

export type ConnectionShapeFromResolve<
  Types extends SchemaTypes,
  Type extends OutputType<Types>,
  Nullable extends boolean,
  EdgeNullability extends FieldNullability<[unknown]>,
  NodeNullability extends boolean,
  Resolved,
> = Resolved extends Promise<infer T>
  ? NonNullable<T> extends ConnectionShapeForType<
      Types,
      Type,
      Nullable,
      EdgeNullability,
      NodeNullability
    >
    ? NonNullable<T>
    : ConnectionShapeForType<Types, Type, Nullable, EdgeNullability, NodeNullability>
  : Resolved extends ConnectionShapeForType<Types, Type, Nullable, EdgeNullability, NodeNullability>
  ? NonNullable<Resolved>
  : ConnectionShapeForType<Types, Type, Nullable, EdgeNullability, NodeNullability>;

export interface DefaultConnectionArguments extends PothosSchemaTypes.DefaultConnectionArguments {}

export type NodeBaseObjectOptionsForParam<
  Types extends SchemaTypes,
  Param extends ObjectParam<Types>,
  Interfaces extends InterfaceParam<Types>[],
> = Omit<ObjectTypeOptions<Types, Param, ParentShape<Types, Param>, Interfaces>, 'isTypeOf'> &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Param extends new (...args: any[]) => any
    ? {
        isTypeOf?: (
          obj: ParentShape<Types, Interfaces[number]>,
          context: Types['Context'],
          info: GraphQLResolveInfo,
        ) => boolean;
      }
    : OutputShape<Types, Param> extends { __type: string }
    ? {
        isTypeOf?: (
          obj: ParentShape<Types, Interfaces[number]>,
          context: Types['Context'],
          info: GraphQLResolveInfo,
        ) => boolean;
      }
    : {
        isTypeOf: (
          obj: ParentShape<Types, Interfaces[number]>,
          context: Types['Context'],
          info: GraphQLResolveInfo,
        ) => boolean;
      });

export type NodeObjectOptions<
  Types extends SchemaTypes,
  Param extends ObjectParam<Types>,
  Interfaces extends InterfaceParam<Types>[],
> = NodeBaseObjectOptionsForParam<Types, Param, Interfaces> & {
  id: Omit<
    FieldOptionsFromKind<
      Types,
      ParentShape<Types, Param>,
      'ID',
      false,
      {},
      'Object',
      OutputShape<Types, 'ID'>,
      MaybePromise<OutputShape<Types, 'ID'>>
    >,
    'args' | 'nullable' | 'type'
  >;
  loadOne?: (
    id: string,
    context: Types['Context'],
  ) => MaybePromise<OutputShape<Types, Param> | null | undefined>;
  loadMany?: (
    ids: string[],
    context: Types['Context'],
  ) => MaybePromise<MaybePromise<OutputShape<Types, Param> | null | undefined>[]>;
  loadWithoutCache?: (
    id: string,
    context: Types['Context'],
    info: GraphQLResolveInfo,
  ) => MaybePromise<OutputShape<Types, Param> | null | undefined>;
};

export type GlobalIDFieldOptions<
  Types extends SchemaTypes,
  ParentShape,
  Args extends InputFieldMap,
  Nullable extends boolean,
  ResolveReturnShape,
  Kind extends FieldKind = FieldKind,
> = Omit<
  FieldOptionsFromKind<
    Types,
    ParentShape,
    'ID',
    Nullable,
    Args,
    Kind,
    ParentShape,
    ResolveReturnShape
  >,
  'resolve' | 'type'
> & {
  resolve: Resolver<
    ParentShape,
    InputShapeFromFields<Args>,
    Types['Context'],
    ShapeFromTypeParam<Types, OutputRefShape<GlobalIDShape<Types> | string>, true>,
    ResolveReturnShape
  >;
};

export type GlobalIDInputFieldOptions<
  Types extends SchemaTypes,
  Req extends boolean,
  Kind extends 'Arg' | 'InputObject',
> = Omit<PothosSchemaTypes.InputFieldOptionsByKind<Types, 'ID', Req>[Kind], 'type'>;

export type GlobalIDListInputFieldOptions<
  Types extends SchemaTypes,
  Req extends FieldRequiredness<['ID']>,
  Kind extends 'Arg' | 'InputObject',
> = Omit<PothosSchemaTypes.InputFieldOptionsByKind<Types, ['ID'], Req>[Kind], 'type'>;

export type NodeIDFieldOptions<
  Types extends SchemaTypes,
  ParentShape,
  Args extends InputFieldMap,
  Nullable extends boolean,
  ResolveReturnShape,
  Kind extends FieldKind = FieldKind,
> = Omit<
  FieldOptionsFromKind<
    Types,
    ParentShape,
    'ID',
    Nullable,
    Args,
    Kind,
    ParentShape,
    ResolveReturnShape
  >,
  'resolve' | 'type'
> & {
  resolve: Resolver<
    ParentShape,
    InputShapeFromFields<Args>,
    Types['Context'],
    ShapeFromTypeParam<Types, OutputRefShape<GlobalIDShape<Types> | string>, true>,
    ResolveReturnShape
  >;
};

export type GlobalIDListFieldOptions<
  Types extends SchemaTypes,
  ParentShape,
  Args extends InputFieldMap,
  Nullable extends FieldNullability<[unknown]>,
  ResolveReturnShape,
  Kind extends FieldKind = FieldKind,
> = Omit<
  FieldOptionsFromKind<
    Types,
    ParentShape,
    ['ID'],
    Nullable,
    Args,
    Kind,
    ParentShape,
    ResolveReturnShape
  >,
  'resolve' | 'type'
> & {
  resolve: Resolver<
    ParentShape,
    InputShapeFromFields<Args>,
    Types['Context'],
    ShapeFromTypeParam<
      Types,
      [OutputRefShape<GlobalIDShape<Types> | string>],
      {
        list: false;
        items: true;
      }
    >,
    ResolveReturnShape
  >;
};

export type NodeFieldOptions<
  Types extends SchemaTypes,
  ParentShape,
  Args extends InputFieldMap,
  ResolveReturnShape,
  Kind extends FieldKind = FieldKind,
> = Omit<
  FieldOptionsFromKind<
    Types,
    ParentShape,
    OutputRefShape<GlobalIDShape<Types> | string>,
    true,
    Args,
    Kind,
    ParentShape,
    ResolveReturnShape
  >,
  'nullable' | 'resolve' | 'type'
> & {
  id: Resolver<
    ParentShape,
    InputShapeFromFields<Args>,
    Types['Context'],
    ShapeFromTypeParam<Types, OutputRefShape<GlobalIDShape<Types> | string>, true>,
    ResolveReturnShape
  >;
};

export type NodeListFieldOptions<
  Types extends SchemaTypes,
  ParentShape,
  Args extends InputFieldMap,
  ResolveReturnShape,
  Kind extends FieldKind = FieldKind,
> = Omit<
  FieldOptionsFromKind<
    Types,
    ParentShape,
    [OutputRefShape<GlobalIDShape<Types> | string>],
    {
      list: false;
      items: true;
    },
    Args,
    Kind,
    ParentShape,
    ResolveReturnShape
  >,
  'nullable' | 'resolve' | 'type'
> & {
  ids: Resolver<
    ParentShape,
    InputShapeFromFields<Args>,
    Types['Context'],
    ShapeFromTypeParam<
      Types,
      [OutputRefShape<GlobalIDShape<Types> | string>],
      {
        list: false;
        items: true;
      }
    >,
    ResolveReturnShape
  >;
};

export interface GlobalIDInputShape {
  [inputShapeKey]: {
    typename: string;
    id: string;
  };
}

export type RelayMutationInputOptions<
  Types extends SchemaTypes,
  Fields extends InputFieldMap,
  InputName extends string,
> = Omit<PothosSchemaTypes.InputObjectTypeOptions<Types, Fields>, 'fields'> & {
  name?: string;
  argName?: InputName;
  inputFields: (t: PothosSchemaTypes.InputFieldBuilder<Types, 'InputObject'>) => Fields;
};

export type RelayMutationFieldOptions<
  Types extends SchemaTypes,
  Fields extends InputFieldMap,
  Nullable extends boolean,
  InputName extends string,
  ResolveShape,
  ResolveReturnShape,
> = Omit<
  FieldOptionsFromKind<
    Types,
    Types['Root'],
    OutputRef<ResolveShape>,
    Nullable,
    {
      [K in InputName]: InputFieldRef<InputShapeWithClientMutationId<Types, Fields>>;
    },
    'Mutation',
    ResolveShape,
    ResolveReturnShape
  >,
  'args' | 'type'
>;

export type RelayMutationPayloadOptions<
  Types extends SchemaTypes,
  Shape,
  Interfaces extends InterfaceParam<Types>[],
> = Omit<
  | PothosSchemaTypes.ObjectTypeOptions<Types, Shape>
  | PothosSchemaTypes.ObjectTypeWithInterfaceOptions<Types, Shape, Interfaces>,
  'fields'
> & {
  name?: string;
  outputFields: ObjectFieldsShape<Types, Shape>;
};

export type InputShapeWithClientMutationId<
  Types extends SchemaTypes,
  Fields extends InputFieldMap,
> = InputShapeFromFields<
  Fields & { clientMutationId: InputFieldRef<Types['Scalars']['ID']['Input']> }
>;
