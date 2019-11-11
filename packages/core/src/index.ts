/* eslint-disable no-restricted-syntax */
import {
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean,
} from 'graphql';
import {
  CompatibleInterfaceNames,
  ShapeFromTypeParam,
  NamedTypeParam,
  ImplementedType,
  EnumValues,
  InputFields,
  InputShapeFromFields,
  ShapedInputFields,
  MergeTypeMap,
  DefaultTypeMap,
  NamedInputAndOutput,
  NullableToOptional,
} from './types';
import ObjectType from './graphql/object';
import UnionType from './graphql/union';
import InputObjectType from './graphql/input';
import InterfaceType from './graphql/interface';
import EnumType from './graphql/enum';
import ScalarType from './graphql/scalar';
import InputFieldBuilder from './fieldUtils/input';
import BasePlugin from './plugin';
import Field from './field';
import BuildCache from './build-cache';

export * from './types';

export {
  BasePlugin,
  Field,
  BuildCache,
  ObjectType,
  InterfaceType,
  UnionType,
  EnumType,
  ScalarType,
  InputObjectType,
};

export default class SchemaBuilder<
  PartialTypes extends GiraphQLSchemaTypes.PartialTypeInfo,
  Types extends MergeTypeMap<DefaultTypeMap, PartialTypes> = MergeTypeMap<
    DefaultTypeMap,
    PartialTypes
  >
> {
  plugins: BasePlugin<Types>[];

  constructor(options: { plugins?: BasePlugin<Types>[] } = {}) {
    this.plugins = options.plugins || [];
  }

  scalars = {
    ID: this.createScalar('ID', GraphQLID),
    Int: this.createScalar('Int', GraphQLInt),
    Float: this.createScalar('Float', GraphQLFloat),
    String: this.createScalar('String', GraphQLString),
    Boolean: this.createScalar('Boolean', GraphQLBoolean),
  };

  createObjectType<
    Shape extends {},
    Interfaces extends InterfaceType<
      {},
      Types,
      CompatibleInterfaceNames<Types, ShapeFromTypeParam<Types, Type, false>>
    >[],
    Type extends Extract<keyof Types['Output'], string>
  >(
    name: Type,
    options: NullableToOptional<
      GiraphQLSchemaTypes.ObjectTypeOptions<Shape, Interfaces, Types, Type>
    >,
  ) {
    return new ObjectType<Shape, Interfaces, Types, Type>(name, options);
  }

  createArgs<Shape extends InputFields<Types>>(shape: (t: InputFieldBuilder<Types>) => Shape) {
    return shape(new InputFieldBuilder<Types>());
  }

  createInterfaceType<Shape extends {}, Type extends Extract<keyof Types['Output'], string>>(
    name: Type,
    options: GiraphQLSchemaTypes.InterfaceTypeOptions<Shape, Types, Type>,
  ) {
    return new InterfaceType<Shape, Types, Type>(name, options);
  }

  createUnionType<Member extends NamedTypeParam<Types>, Name extends string>(
    name: Name,
    options: GiraphQLSchemaTypes.UnionOptions<Types, Member>,
  ) {
    return new UnionType<Types, Name, Member>(name, options);
  }

  createEnumType<Name extends string, Values extends EnumValues>(
    name: Name,
    options: GiraphQLSchemaTypes.EnumTypeOptions<Values>,
  ) {
    return new EnumType(name, options);
  }

  createScalar<Name extends NamedInputAndOutput<Types>>(name: Name, scalar: GraphQLScalarType) {
    return new ScalarType<Types, Name>(name, scalar);
  }

  createInputType<
    Name extends string,
    Fields extends Name extends keyof Types['Input']
      ? ShapedInputFields<Types, Types['Input'][Name]>
      : InputFields<Types>,
    Shape extends Name extends keyof Types['Input']
      ? Types['Input'][Name]
      : InputShapeFromFields<Types, Fields>
  >(name: Name, options: GiraphQLSchemaTypes.InputTypeOptions<Types, Fields>) {
    return new InputObjectType<
      Types,
      Shape,
      Fields,
      Name,
      InputShapeFromFields<Types, Fields, undefined>
    >(name, options);
  }

  toSchema(types: ImplementedType<Types>[]) {
    const scalars = [
      this.scalars.Boolean,
      this.scalars.Float,
      this.scalars.ID,
      this.scalars.Int,
      this.scalars.String,
    ];

    const buildCache = new BuildCache<Types>([...scalars, ...types], this.plugins);

    buildCache.buildAll();

    return new GraphQLSchema({
      query: buildCache.has('Query') ? buildCache.getBuiltObject('Query') : undefined,
      mutation: buildCache.has('Mutation') ? buildCache.getBuiltObject('Mutation') : undefined,
    });
  }
}