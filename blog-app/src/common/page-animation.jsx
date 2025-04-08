import { motion, AnimatePresence } from "motion/react";

const AnimationWrapper = ({
	children,
	initial = { opacity: 0 },
	animate = { opacity: 1 },
	transition = { duration: 0.5 },
	className,
	keyValue,
}) => {
	return (
		<AnimatePresence>
			<motion.div
				initial={initial}
				animate={animate}
				transition={transition}
				key={keyValue}
				className={className}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
export default AnimationWrapper;
