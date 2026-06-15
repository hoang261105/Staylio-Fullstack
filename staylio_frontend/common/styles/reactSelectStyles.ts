export const rsStyles = {
  control: (base: object, s: { isFocused: boolean; isDisabled: boolean }) => ({
    ...base,
    borderColor: s.isFocused ? "var(--primary)" : "var(--border)",
    boxShadow: s.isFocused ? "0 0 0 1px var(--primary)" : "none",
    borderRadius: "0.5rem",
    padding: "2px 0",
    opacity: s.isDisabled ? 0.5 : 1,
    "&:hover": { borderColor: "var(--primary)" },
    backgroundColor: "hsl(var(--background))",
  }),
  placeholder: (base: object) => ({ ...base, color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }),
  singleValue: (base: object) => ({ ...base, fontSize: "0.875rem", color: "hsl(var(--foreground))" }),
  option: (base: object, s: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: s.isSelected ? "hsl(var(--primary))" : s.isFocused ? "hsl(var(--muted))" : "hsl(var(--background))",
    color: s.isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
  }),
  menu: (base: object) => ({
    ...base,
    backgroundColor: "hsl(var(--background))",
    border: "1px solid hsl(var(--border))",
    zIndex: 9999
  }),
  menuPortal: (base: object) => ({ ...base, zIndex: 9999 }),
};
