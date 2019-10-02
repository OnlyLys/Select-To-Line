import { ThemeColor } from 'vscode';
import { ConfigurationHandler } from '@onlylys/vscode-configuration-handler';
import { COLUMN_DEFAULTS_TO } from './column-defaults-to';

/** A readonly snapshot of the configuration values of this extension. */
export class Config {

    /** Color of the pseudocursor when revealing the target of a 'go to' or selection. */
    public readonly pseudocursorColor: string | ThemeColor;

    /** Color used to highlight the target line(s) of a 'go to' or 'Quick Selection' operation. */
    public readonly lineHighlightColor: string | ThemeColor;

    /** Color used to highlight the target range of a selection. */
    public readonly rangeHighlightColor: string | ThemeColor;
    
    /** 
     * The delay in `ms` before changing the viewport to reveal a target that is partially or totally
     * outside the visible region of the viewport.
     */
    public readonly viewportChangeDelay: number;

    /** What the column number defaults to if it is not specified. */
    public columnDefaultsTo: COLUMN_DEFAULTS_TO;

    private constructor() {
        this.pseudocursorColor   = pseudocursorColorHandler.get().effectiveValue;
        this.lineHighlightColor  = lineHighlightColorHandler.get().effectiveValue;
        this.rangeHighlightColor = rangeHighlightColorHandler.get().effectiveValue;
        this.viewportChangeDelay = viewportChangeDelayHandler.get().effectiveValue;
        this.columnDefaultsTo    = columnDefaultsToHandler.get().effectiveValue;
    }

    /** Get the latest values of the extension's settings. */
    public static get(): Config {
        return new Config();
    }

}

function isColorType(value: any): value is (string | ThemeColor) {
    return typeof value === 'string' || (typeof value === 'object' && typeof value.id === 'string');
}

export const pseudocursorColorHandler = new ConfigurationHandler<string | ThemeColor>({
    name: `select-to-line.pseudocursorColor`,
    typecheck: isColorType
});

export const rangeHighlightColorHandler = new ConfigurationHandler<string | ThemeColor>({
    name: `select-to-line.rangeHighlightColor`,
    typecheck: isColorType
});

export const lineHighlightColorHandler = new ConfigurationHandler<string | ThemeColor>({
    name: `select-to-line.lineHighlightColor`,
    typecheck: isColorType
});

export const viewportChangeDelayHandler = new ConfigurationHandler<number>({
    name: `select-to-line.viewportChangeDelay`,
    typecheck: (value: any): value is number => typeof value === 'number'
});

export const columnDefaultsToHandler = new ConfigurationHandler<COLUMN_DEFAULTS_TO>({
    name: `select-to-line.columnDefaultsTo`,
    typecheck: (value: any): value is COLUMN_DEFAULTS_TO => {
        switch (value) {
            case COLUMN_DEFAULTS_TO.START_OF_LINE:
            case COLUMN_DEFAULTS_TO.END_OF_LINE:
            case COLUMN_DEFAULTS_TO.FIRST_NON_WHITESPACE_CHARACTER_OF_LINE:
            case COLUMN_DEFAULTS_TO.ONE_PAST_LAST_NON_WHITESPACE_CHARACTER_OF_LINE:
                return true;
            default:
                return false;
        }
    }
});
