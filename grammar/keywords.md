# Kora Language Keywords

## Reserved Keywords

These words are **reserved** and cannot be used as identifiers.

### Module & Structure Keywords

- `module` - Declares a module (domain, ui)
- `domain` - Domain layer module
- `ui` - UI layer module
- `api` - API endpoint declaration
- `page` - Page component declaration
- `type` - Type definition
- `const` - Constant declaration

### Control Flow Keywords

- `if` - Conditional statement
- `else` - Alternative branch
- `for` - Loop statement
- `in` - Iterator in for loops
- `return` - Return from function/handler

### Variable Keywords

- `let` - Variable declaration

### Type Keywords

- `String` - String primitive type
- `Number` - Number primitive type
- `Boolean` - Boolean primitive type
- `UUID` - UUID type
- `Email` - Email type
- `Date` - Date type
- `Void` - Void type (no return value)

### API Keywords

- `input` - API input definition
- `output` - API output definition
- `handler` - API handler implementation

### Page Keywords

- `load` - Page data loading function
- `view` - Page view rendering function
- `uses` - Module dependency declaration

### Literal Keywords

- `true` - Boolean true
- `false` - Boolean false
- `null` - Null value
- `undefined` - Undefined value

## Contextual Keywords

These words have special meaning in specific contexts but can be used as identifiers elsewhere.

- `->` - Return type annotation (arrow)
- `?` - Optional type modifier
- `<` - Generic type parameter start / JSX tag start
- `>` - Generic type parameter end / JSX tag end
- `{` - Block start / JSX expression start
- `}` - Block end / JSX expression end
- `(` - Function/expression grouping start
- `)` - Function/expression grouping end
- `[` - Array/object access start
- `]` - Array/object access end

## Operators

### Arithmetic Operators
- `+` - Addition
- `-` - Subtraction
- `*` - Multiplication
- `/` - Division

### Comparison Operators
- `==` - Equality
- `!=` - Inequality
- `<` - Less than
- `>` - Greater than
- `<=` - Less than or equal
- `>=` - Greater than or equal

### Logical Operators
- `&&` - Logical AND
- `||` - Logical OR
- `!` - Logical NOT

### Other Operators
- `=` - Assignment
- `.` - Member access
- `:` - Type annotation
- `,` - Separator
- `;` - Statement terminator

## Naming Conventions

### Identifiers
- Must start with a letter or underscore
- Can contain letters, digits, and underscores
- Case-sensitive
- Examples: `userId`, `UserProfile`, `get_user_data`

### Type Names
- PascalCase for custom types
- Examples: `User`, `UserProfile`, `ApiResponse`

### Variable Names
- camelCase for variables and functions
- Examples: `userId`, `getUser`, `userProfile`

### Module Names
- PascalCase for module names
- Examples: `UserDomain`, `GetUserApi`, `ProfilePage`

### Constants
- UPPER_SNAKE_CASE for constants
- Examples: `MAX_USERS`, `DEFAULT_TIMEOUT`

## Reserved for Future Use

These keywords are reserved for future language features:

- `async` - Async functions
- `await` - Await expressions
- `import` - Module imports
- `export` - Module exports
- `class` - Class definitions
- `interface` - Interface definitions
- `enum` - Enum definitions
- `namespace` - Namespace definitions
- `try` - Try-catch blocks
- `catch` - Catch clause
- `throw` - Throw exceptions
- `switch` - Switch statements
- `case` - Case clause
- `default` - Default clause
- `break` - Break statement
- `continue` - Continue statement
- `while` - While loop
- `do` - Do-while loop
- `function` - Function declaration
- `async` - Async function
- `yield` - Generator yield


