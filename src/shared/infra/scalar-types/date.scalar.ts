import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  // Converts Date String to Date JS Object
  parseValue(value: string): Date {
    return new Date(value);
  }

  // Serialize the value to send to client
  serialize(value: Date): string {
    return value.toISOString();
  }

  // Process the Query AST
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
