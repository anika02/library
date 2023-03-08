/**
 * x-small - 1 rem (16px)
 * small - 1.5 rem (24px)
 * medium - 2.25 rem (36px) //default
 * large - 3 rem (48px)
 */
export const sizes = new Set([ 'large', 'medium', 'small', 'x-small' ]);

export const variants = new Set([
    'primary',
    'secondary',
    'link',
    'destructive',
    'destructive-secondary',
]);

export const mapSizeToClasses = {
    large: 'p-3 h-12 min-w-12',
    medium: 'px-3 py-2 h-9 min-w-9', //default
    small: 'py-1 px-2 h-6 min-w-6',
    'x-small': 'h-4 min-w-4',
};

export const mapTextClassesToSizes = {
    large: 'ui-subtitle',
    medium: 'ui-body-2-highlight', //default
    small: 'ui-overline text-uppercase',
    'x-small': 'ui-caption',
};

export const mapIconClassesToSizes = {
    large: 'h-6 w-6',
    medium: 'h-4 w-4', //default
    small: 'h-4 w-4',
    'x-small': 'h-4 w-4',
};