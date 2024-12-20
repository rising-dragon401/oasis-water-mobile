import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { TextClassContext } from "./text";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-primary web:hover:opacity-90 active:opacity-90",
				destructive: "bg-destructive web:hover:opacity-90 active:opacity-90",
				outline:
					" text-primary border border-border bg-background web:hover:text-accent-foreground ",
				secondary: "!bg-secondary web:hover:opacity-80 active:opacity-80",
				ghost: "web:hover:text-accent-foreground",
				link: "web:underline-offset-4 web:hover:underline web:focus:underline ",
			},
			size: {
				default: "h-12 px-4 py-2 native:h-14 native:px-5 native:py-3",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8 native:h-14",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const buttonTextVariants = cva(
	"web:whitespace-nowrap text-base native:text-base web:transition-colors",
	{
		variants: {
			variant: {
				default: "!text-background !font-bold",
				destructive: "text-secondary",
				outline: "!text-primary group-active:text-accent-foreground",
				secondary: "text-primary ",
				ghost: "group-active:text-accent-foreground font-normal",
				link: "text-primary group-active:underline",
			},
			size: {
				default: "",
				sm: "",
				lg: "native:text-lg",
				icon: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof buttonVariants> & {
		label?: string;
		icon?: React.ReactNode;
		iconPosition?: "left" | "right";
		loading?: boolean;
		textClassName?: string;
	};

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	ButtonProps
>(
	(
		{
			className,
			textClassName,
			variant,
			size,
			label,
			icon,
			iconPosition = "right",
			loading,
			...props
		},
		ref,
	) => {
		return (
			<TextClassContext.Provider
				value={cn(
					props.disabled && "web:pointer-events-none",
					buttonTextVariants({ variant, size }),
				)}
			>
				<Pressable
					className={cn(
						props.disabled && "opacity-50 web:pointer-events-none",
						buttonVariants({ variant, size, className }),
						"rounded-full flex items-center justify-center",
						className,
					)}
					ref={ref}
					role="button"
					{...props}
				>
					<View className="flex flex-row gap-2 items-center justify-center">
						{icon && iconPosition === "left" && <>{icon}</>}

						{label && (
							<Text
								className={cn(
									"flex items-center justify-center",
									buttonTextVariants({ variant, size }),
									textClassName,
								)}
							>
								{label}
							</Text>
						)}

						{icon && iconPosition === "right" && <>{icon}</>}

						{loading && <ActivityIndicator size="small" />}
					</View>
				</Pressable>
			</TextClassContext.Provider>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
