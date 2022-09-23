#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { TransformModule } from "./commands/transform.js";

yargs(hideBin(process.argv))
    // Use the commands directory to scaffold.
    .command(TransformModule)
    // Enable strict mode.
    .strict()
    // Useful aliases.
    .alias({ h: "help" })
    .argv;
