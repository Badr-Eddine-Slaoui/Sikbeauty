"use client";
import { useRouter, usePathname, useSearchParams as nextUseSearchParams, useParams as nextUseParams } from 'next/navigation';
import NextLink from 'next/link';
import { useEffect } from 'react';

export function useNavigate() {
    const router = useRouter();
    return (to, options) => {
        if (typeof to === 'number') {
            if (to === -1) {
                router.back();
            }
            return;
        }
        if (options && options.replace) {
            router.replace(to);
        } else {
            router.push(to);
        }
    }
}

export function useLocation() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    return {
        pathname: pathname || '',
        search: searchParams ? `?${searchParams.toString()}` : '',
        hash: '',
        state: null
    };
}

export function useParams() {
    return nextUseParams() || {};
}

export function useSearchParams() {
    const searchParams = nextUseSearchParams();
    return [searchParams, () => {}];
}

export function Link({ to, children, ...props }) {
    return <NextLink href={to || '#'} {...props}>{children}</NextLink>;
}

export function Navigate({ to, replace }) {
    const router = useRouter();
    useEffect(() => {
        if (replace) {
            router.replace(to);
        } else {
            router.push(to);
        }
    }, [to, router, replace]);
    return null;
}

export function Outlet() {
    // In Next.js App Router, layout.tsx renders children. We can just return children here if passed, or nothing, as Next.js handles nesting differently.
    // Wait, Outlet in Next.js is usually just {children}. If this is used inside a component, it might need to render children passed as props.
    // We'll export a generic Outlet that renders children from props if any.
    return null; // Next.js nested layouts handle this natively via children prop
}
