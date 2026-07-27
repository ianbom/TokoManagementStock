import { Search } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

type AppPageHeaderProps = React.ComponentProps<'header'> & {
    backgroundImage?: string;
    overlayClassName?: string;
};

export function AppPageHeader({
    backgroundImage,
    overlayClassName,
    className,
    style,
    children,
    ...props
}: AppPageHeaderProps) {
    return (
        <header
            className={cn(
                backgroundImage && 'relative overflow-hidden bg-cover',
                className,
            )}
            style={{
                ...style,
                ...(backgroundImage
                    ? { backgroundImage: `url(${backgroundImage})` }
                    : {}),
            }}
            {...props}
        >
            {backgroundImage ? (
                <div
                    aria-hidden="true"
                    className={cn(
                        'absolute inset-0 bg-[rgba(8,31,58,0.84)]',
                        overlayClassName,
                    )}
                />
            ) : null}
            {children}
        </header>
    );
}

type AppPageHeaderHeadingProps = Omit<React.ComponentProps<'div'>, 'title'> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    titleClassName?: string;
    descriptionClassName?: string;
};

export function AppPageHeaderHeading({
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
    ...props
}: AppPageHeaderHeadingProps) {
    return (
        <div className={className} {...props}>
            <h1 className={titleClassName}>{title}</h1>
            {description ? (
                <p className={descriptionClassName}>{description}</p>
            ) : null}
        </div>
    );
}

type AppPageHeaderSearchProps = Omit<
    React.ComponentProps<'input'>,
    'className' | 'type'
> & {
    'aria-label': string;
    wrapperClassName?: string;
    iconClassName?: string;
    inputClassName?: string;
    iconStrokeWidth?: number;
    trailing?: React.ReactNode;
};

export function AppPageHeaderSearch({
    wrapperClassName,
    iconClassName,
    inputClassName,
    iconStrokeWidth = 1.8,
    trailing,
    ...props
}: AppPageHeaderSearchProps) {
    return (
        <div className={wrapperClassName}>
            <Search
                aria-hidden="true"
                className={iconClassName}
                strokeWidth={iconStrokeWidth}
            />
            <input type="search" className={inputClassName} {...props} />
            {trailing}
        </div>
    );
}
