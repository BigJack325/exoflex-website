import clsx from "clsx";

type BoundedProps = {
  className?: string; // outer section
  containerClassName?: string; // inner container
  children: React.ReactNode;
};

export const Bounded = ({
  className,
  containerClassName,
  children,
  ...restProps
}: BoundedProps) => {
  return (
    <section
      className={clsx("px-4 first:pt-10 md:px-6", className)}
      {...restProps}
    >
      <div
        className={clsx(
          "mx-auto w-full max-w-screen-2xl flex flex-col items-center",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
};

Bounded.displayName = "Bounded";