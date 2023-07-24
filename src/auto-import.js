/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2018-present Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const newImport = (range, identifier, addNewLine, importConfig) => {
  const { packageName, style } = importConfig;
  const specifier = style === 'default' ? identifier : `{ ${identifier} }`;
  const importStatement = `import ${specifier} from '${packageName}';`;
  const textToInsert = `\n${importStatement}${addNewLine ? '\n' : ''}`;
  return {
    isImported: false,
    fix: fixer => fixer.insertTextAfterRange(range, textToInsert),
  };
};

const existingImport = (importNode, identifier, { style }) => {
  const location = importNode.loc;
  const isMultiLine = location.end.line - location.start.line > 0;
  const isImported = !!importNode.specifiers.find(
    ({ local }) => local.name === identifier,
  );

  const textToInsert =
    style === 'default'
      ? `${identifier}${importNode.specifiers.length > 0 ? ', ' : ''}`
      : `${identifier},${isMultiLine ? '\n' : ' '}`;

  return {
    isImported,
    fix(fixer) {
      if (isImported) {
        return null;
      }

      if (style === 'default') {
        const range = [importNode.range[0] + 6, importNode.range[0] + 7];
        return fixer.insertTextAfterRange(range, textToInsert);
      }
      // TODO: should we care about identation?
      // put first to avoid any problems with trailing commas
      return fixer.insertTextBefore(importNode.specifiers[0], textToInsert);
    },
  };
};

const findProgramNode = node =>
  node.type !== 'Program' ? findProgramNode(node.parent) : node;

const findImportNode = (program, { packageName }) => {
  for (let i = 0; ; i += 1) {
    const currNode = program.body[i];

    if (currNode.type !== 'ImportDeclaration') {
      return null;
    }

    if (currNode.source.value === packageName) {
      return currNode;
    }
  }
};

const getNewImport = (program, identifier, importConfig) => {
  const startRange =
    program.comments && program.comments.length
      ? program.comments[program.comments.length - 1].range
      : [0, 0];

  // Insert a new import in the 'best' position.
  // This is after all imports or before the first relative import
  for (let i = 0; ; i += 1) {
    const currNode = program.body[i];
    if (currNode.type !== 'ImportDeclaration') {
      const range = i === 0 ? startRange : program.body[i - 1].range;
      const hasImports = program.body[0].type === 'ImportDeclaration';
      return newImport(range, identifier, !hasImports, importConfig);
    }

    if (currNode.source.value.indexOf('.') === 0) {
      const range = i === 0 ? startRange : program.body[i - 1].range;
      return newImport(range, identifier, false, importConfig);
    }
  }
};

module.exports = {
  getImportDefinition(node, identifier, importConfig) {
    const program = findProgramNode(node);
    const importNode = findImportNode(program, importConfig);
    return importNode
      ? existingImport(importNode, identifier, importConfig)
      : getNewImport(program, identifier, importConfig);
  },
  addImport: (fixer, importDefinition) => importDefinition.fix(fixer),
};
