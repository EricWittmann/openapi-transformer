import type { Arguments, CommandBuilder } from "yargs";
import { CommandModule } from "yargs";
import * as fs from "fs";
import {
    Document,
    IPropertySchema,
    Library,
    OasSchema,
    TraverserDirection,
    CombinedVisitorAdapter, Extension, ExtensibleNode
} from "@apicurio/data-models";

interface Transformation {
    transform(doc: Document): void;
}

/**
 * Base class for all transformations that are based on a single visitor.
 */
abstract class AbstractVisitorBasedTransformation extends CombinedVisitorAdapter implements Transformation {
    public transform(doc: Document): void {
        Library.visitTree(doc, this, TraverserDirection.down);
    }
}

/**
 * Transformation to switch all "date-time" schema properties to "utc-date".
 */
class UtcDateTransformation extends AbstractVisitorBasedTransformation {
    visitPropertySchema(node: IPropertySchema) {
        const schema: OasSchema = node as any;
        if (schema.format === "date-time") {
            schema.format = "utc-date";
        }
    }
}

/**
 * Transformation to remove all x-* extensions from the doc.
 */
class RemoveExtensionsTransformation extends AbstractVisitorBasedTransformation {
    visitExtension(node: Extension) {
        (node.parent() as ExtensibleNode).removeExtension(node.name);
    }
}


type Options = {
    inputSpec: string;
    outputSpec: string;
};

const command: string = "transform <inputSpec> <outputSpec>";
const describe: string = "Transform an OpenAPI specification";

// eslint-disable-next-line @typescript-eslint/ban-types
const builder: CommandBuilder<{}, Options> = (yargs) =>
    yargs
        .positional("inputSpec", { type: "string", demandOption: true })
        .positional("outputSpec", { type: "string", demandOption: true })
;

const handler = (argv: Arguments<Options>): void => {
    const { inputSpec, outputSpec } = argv;
    process.stdout.write("Transforming OpenAPI specification at: " + inputSpec + "\n");
    const inputData: string = fs.readFileSync(inputSpec, { encoding: "utf8" });

    // Read the input into a data-models AST
    const doc: Document = Library.readDocumentFromJSONString(inputData);

    // Perform the UTC date transformation
    const utcDataTransformation: Transformation = new UtcDateTransformation();
    utcDataTransformation.transform(doc);

    // Perform other transformations...
    const removeExtensionsTransformation: Transformation = new RemoveExtensionsTransformation();
    removeExtensionsTransformation.transform(doc);

    // Output the transformed document to the output
    const outputContent: string = JSON.stringify(Library.writeNode(doc), null, 4);
    fs.writeFileSync(outputSpec, outputContent, { encoding: "utf8" });

    // Exit successfully.
    process.stdout.write("Transformation completed successfully!\n");
    process.exit(0);
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const TransformModule: CommandModule<{}, Options> = {
    builder,
    command,
    describe,
    handler
};
