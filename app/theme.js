// app/theme.js — Global color theme for Bookshop
// Import this in every page: import { colors, btn, card, input, topbar, badge } from '../../theme';

export const colors = {
    primary: '#6b21a8',      // deep purple
    primaryLight: '#7e22ce',
    primaryDark: '#4c1d95',
    accent: '#f59e0b',       // golden yellow
    accentLight: '#fbbf24',
    accentDark: '#d97706',
    bg: '#f5f3ff',           // very light purple bg
    white: '#ffffff',
    text: '#1e1b4b',         // dark navy text
    textMuted: '#6b7280',
    danger: '#dc2626',
    success: '#16a34a',
    border: '#ddd6fe',
};

export const topbar = {
    background: colors.primary,
    color: colors.white,
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
};

export const card = {
    base: {
        background: colors.white,
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(107,33,168,0.08)',
        border: `1px solid ${colors.border}`,
        padding: '20px',
        transition: 'box-shadow 0.2s',
    },
    hover: {
        boxShadow: '0 6px 24px rgba(107,33,168,0.15)',
    },
};

export const btn = {
    primary: {
        background: colors.primary,
        color: colors.white,
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'background 0.2s',
    },
    accent: {
        background: colors.accent,
        color: colors.text,
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '14px',
        transition: 'background 0.2s',
    },
    outline: {
        background: 'transparent',
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s',
    },
    danger: {
        background: colors.danger,
        color: colors.white,
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
    },
};

export const input = {
    base: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: `1.5px solid ${colors.border}`,
        fontSize: '14px',
        color: colors.text,
        outline: 'none',
        boxSizing: 'border-box',
        background: colors.white,
        transition: 'border 0.2s',
    },
};

export const badge = {
    purple: {
        background: '#ede9fe',
        color: colors.primary,
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    yellow: {
        background: '#fef3c7',
        color: colors.accentDark,
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    green: {
        background: '#dcfce7',
        color: colors.success,
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
};

export const pageWrapper = {
    minHeight: '100vh',
    background: colors.bg,
    fontFamily: "'Segoe UI', sans-serif",
};