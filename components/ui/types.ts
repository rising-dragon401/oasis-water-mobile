import type { Pressable, Text, View, ViewStyle } from "react-native";

type ComponentPropsWithAsChild<T extends React.ElementType<any>> =
	React.ComponentPropsWithoutRef<T> & { asChild?: boolean };

type ViewRef = React.ElementRef<typeof View>;
type PressableRef = React.ElementRef<typeof Pressable>;
type TextRef = React.ElementRef<typeof Text>;

type SlottableViewProps = ComponentPropsWithAsChild<typeof View>;
type SlottablePressableProps = ComponentPropsWithAsChild<typeof Pressable> & {
	/**
	 * Platform: WEB ONLY
	 */
	onKeyDown?: (ev: React.KeyboardEvent) => void;
	/**
	 * Platform: WEB ONLY
	 */
	onKeyUp?: (ev: React.KeyboardEvent) => void;
};
type SlottableTextProps = ComponentPropsWithAsChild<typeof Text>;

interface Insets {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
}

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

/**
 * Certain props are only available on the native version of the component.
 * @docs For the web version, see the Radix documentation https://www.radix-ui.com/primitives
 */
interface PositionedContentProps {
	forceMount?: true | undefined;
	style?: ViewStyle;
	alignOffset?: number;
	insets?: Insets;
	avoidCollisions?: boolean;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom";
	sideOffset?: number;
	/**
	 * Platform: NATIVE ONLY
	 */
	disablePositioningStyle?: boolean;
	/**
	 * Platform: WEB ONLY
	 */
	loop?: boolean;
	/**
	 * Platform: WEB ONLY
	 */
	onCloseAutoFocus?: (event: Event) => void;
	/**
	 * Platform: WEB ONLY
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	/**
	 * Platform: WEB ONLY
	 */
	onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
	/**
	 * Platform: WEB ONLY
	 */
	onFocusOutside?: (event: FocusOutsideEvent) => void;
	/**
	 * Platform: WEB ONLY
	 */
	onInteractOutside?: (
		event: PointerDownOutsideEvent | FocusOutsideEvent,
	) => void;
	/**
	 * Platform: WEB ONLY
	 */
	collisionBoundary?: Element | null | (Element | null)[];
	/**
	 * Platform: WEB ONLY
	 */
	sticky?: "partial" | "always";
	/**
	 * Platform: WEB ONLY
	 */
	hideWhenDetached?: boolean;
}

interface ForceMountable {
	forceMount?: true | undefined;
}

interface ProgressRootProps {
	value?: number | null | undefined;
	max?: number;
	getValueLabel?(value: number, max: number): string;
}

interface ToggleRootProps {
	pressed: boolean;
	onPressedChange: (pressed: boolean) => void;
	disabled?: boolean;
}

type RootProps = SlottableViewProps & {
	onOpenChange?: (open: boolean) => void;
	/**
	 * Platform: WEB ONLY
	 * @default 700
	 */
	delayDuration?: number;
	/**
	 * Platform: WEB ONLY
	 * @default 300
	 */
	skipDelayDuration?: number;
	/**
	 * Platform: WEB ONLY
	 */
	disableHoverableContent?: boolean;
};

interface PortalProps extends ForceMountable {
	children: React.ReactNode;
	/**
	 * Platform: NATIVE ONLY
	 */
	hostName?: string;
	/**
	 * Platform: WEB ONLY
	 */
	container?: HTMLElement | null | undefined;
}

type OverlayProps = ForceMountable &
	SlottablePressableProps & {
		closeOnPress?: boolean;
	};

type ContentProps = SlottableViewProps &
	Omit<PositionedContentProps, "side"> & {
		/**
		 * `left` and `right` are only supported on web.
		 */
		side?: "top" | "right" | "bottom" | "left";
	};

type TriggerProps = SlottablePressableProps;

type RootRef = ViewRef;
type ContentRef = ViewRef;
type OverlayRef = PressableRef;
type TriggerRef = PressableRef & {
	open: () => void;
	close: () => void;
};

export type {
	ContentProps,
	ContentRef,
	OverlayProps,
	OverlayRef,
	PortalProps,
	RootProps,
	RootRef,
	TriggerProps,
	TriggerRef,
};

export type {
	ComponentPropsWithAsChild,
	ForceMountable,
	Insets,
	PositionedContentProps,
	PressableRef,
	ProgressRootProps,
	SlottablePressableProps,
	SlottableTextProps,
	SlottableViewProps,
	TextRef,
	ToggleRootProps,
	ViewRef,
};
