/* @ds-bundle: {"format":4,"namespace":"AgNciaBowDesignSystem_6c8cb0","components":[{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"}],"sourceHashes":{"components/feedback/Badge.jsx":"109492584db8","components/feedback/Tag.jsx":"c0b56b09804f","components/feedback/Tooltip.jsx":"b480c5ebd66b","components/forms/Button.jsx":"6b1dd4b00d1f","components/forms/Checkbox.jsx":"bda6b69e534d","components/forms/IconButton.jsx":"8efe5b62fb3c","components/forms/Input.jsx":"4e8c3db9d310","components/forms/Select.jsx":"c789d76f95b6","components/forms/Switch.jsx":"14827d8ac986","components/surfaces/Card.jsx":"c91a22c1dc2e","components/surfaces/Dialog.jsx":"d3bcc902089f","ui_kits/website/Footer.jsx":"d4a43d725896","ui_kits/website/Header.jsx":"b9253c863cda","ui_kits/website/Hero.jsx":"5a6de2baf13d","ui_kits/website/LogoStrip.jsx":"5d8da6f418ae","ui_kits/website/Method.jsx":"edfbbe4a8234","ui_kits/website/MubyShowcase.jsx":"342372fa4ce6","ui_kits/website/Solutions.jsx":"3204726eaa5b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AgNciaBowDesignSystem_6c8cb0 = window.AgNciaBowDesignSystem_6c8cb0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/feedback/Badge.jsx
try { (() => {
function Badge({
  children,
  variant = "gradient"
}) {
  const variants = {
    gradient: {
      background: "var(--accent-gradient)",
      color: "#fff"
    },
    green: {
      background: "var(--bow-green)",
      color: "#08260a"
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 16px",
      borderRadius: "var(--radius-pill)",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-caption)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-wide)",
      textTransform: "uppercase",
      ...variants[variant]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function Tag({
  number,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontFamily: "var(--font-body)"
    }
  }, number != null && /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--accent-gradient)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "var(--text-caption)",
      padding: "6px 14px",
      borderRadius: "var(--radius-pill)"
    }
  }, number), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-primary)",
      fontSize: "var(--text-body-sm)",
      fontWeight: 500
    }
  }, children));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const {
  useState
} = React;
function Tooltip({
  label,
  children
}) {
  const [show, setShow] = useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: "calc(100% + 8px)",
      left: "50%",
      transform: "translateX(-50%)",
      background: "var(--bow-black-elevated)",
      color: "var(--text-primary)",
      padding: "6px 12px",
      borderRadius: "var(--radius-sm)",
      fontSize: "var(--text-caption)",
      whiteSpace: "nowrap",
      fontFamily: "var(--font-body)",
      boxShadow: "var(--shadow-md)",
      zIndex: 10
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
const sizes = {
  sm: {
    padding: "8px 18px",
    fontSize: "var(--text-body-sm)"
  },
  md: {
    padding: "12px 24px",
    fontSize: "var(--text-body)"
  },
  lg: {
    padding: "16px 32px",
    fontSize: "var(--text-body-lg)"
  }
};
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    borderRadius: "var(--radius-pill)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "transform var(--duration-fast) var(--ease-standard), filter var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--accent-gradient)",
      color: "#fff"
    },
    secondary: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-primary)"
    },
    dark: {
      background: "var(--bow-black)",
      color: "#fff"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = "brightness(1.12)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = "none";
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
const {
  useState
} = React;
function Checkbox({
  label,
  defaultChecked = false,
  disabled = false
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-body)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && setChecked(!checked),
    style: {
      width: 20,
      height: 20,
      borderRadius: "6px",
      border: checked ? "none" : "1px solid var(--border-strong)",
      background: checked ? "var(--bow-green)" : "transparent",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background var(--duration-fast) var(--ease-standard)"
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "10",
    viewBox: "0 0 12 10",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 5L4.5 8.5L11 1",
    stroke: "#08260a",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm)",
      color: "var(--text-primary)"
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function IconButton({
  children,
  size = 44,
  variant = "solid",
  onClick,
  style
}) {
  const variants = {
    solid: {
      background: "var(--bow-green)",
      color: "#08260a"
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    },
    dark: {
      background: "var(--bow-black-elevated)",
      color: "#fff"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "var(--shadow-md)",
      transition: "transform var(--duration-fast) var(--ease-standard)",
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(0.94)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "scale(1)";
    }
  }, children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  placeholder,
  label,
  type = "text",
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      fontFamily: "var(--font-body)",
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    disabled: disabled,
    style: {
      background: "var(--bow-black-elevated)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      padding: "13px 16px",
      fontSize: "var(--text-body)",
      fontFamily: "var(--font-body)",
      outline: "none",
      opacity: disabled ? 0.5 : 1,
      transition: "border-color var(--duration-fast) var(--ease-standard)",
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = "var(--focus-ring)";
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = "var(--border-subtle)";
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      fontFamily: "var(--font-body)",
      width: "100%"
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm)",
      color: "var(--text-secondary)"
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    disabled: disabled,
    style: {
      background: "var(--bow-black-elevated)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      padding: "13px 16px",
      fontSize: "var(--text-body)",
      fontFamily: "var(--font-body)",
      outline: "none",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
const {
  useState
} = React;
function Switch({
  defaultOn = false,
  disabled = false,
  label
}) {
  const [on, setOn] = useState(defaultOn);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "var(--font-body)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && setOn(!on),
    style: {
      width: 44,
      height: 26,
      borderRadius: "var(--radius-pill)",
      padding: "3px",
      background: on ? "var(--bow-green)" : "var(--bow-gray-700)",
      display: "inline-flex",
      justifyContent: on ? "flex-end" : "flex-start",
      transition: "background var(--duration-fast) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#fff",
      transition: "transform var(--duration-fast) var(--ease-standard)"
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm)",
      color: "var(--text-primary)"
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function Card({
  variant = "dark",
  children,
  style
}) {
  const variants = {
    dark: {
      background: "var(--surface-card)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-subtle)"
    },
    light: {
      background: "var(--surface-card-light)",
      color: "var(--text-primary-on-light)"
    },
    gradient: {
      background: "var(--accent-gradient)",
      color: "#fff"
    },
    outline: {
      background: "transparent",
      color: "var(--text-primary)",
      border: "1px solid var(--border-strong)"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-8)",
      boxShadow: "var(--shadow-sm)",
      fontFamily: "var(--font-body)",
      ...variants[variant],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  children,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--bow-black-elevated)",
      color: "var(--text-primary)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-8)",
      maxWidth: 420,
      boxShadow: "var(--shadow-lg)",
      fontFamily: "var(--font-body)",
      border: "1px solid var(--border-subtle)"
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      margin: "0 0 12px",
      fontSize: "var(--text-h2)"
    }
  }, title), children));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Dialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
function Footer() {
  const cols = [{
    h: "Soluções",
    items: ["Consultoria e diagnóstico", "Estratégia digital", "Aquisição paga", "SEO e GEO", "Branding"]
  }, {
    h: "Bow",
    items: ["Cases", "Sobre", "Blog", "Carreiras"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--bow-gray-900)",
      padding: "64px 40px 32px",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 64,
      flexWrap: "wrap",
      marginBottom: 48
    }
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontWeight: 700,
      marginBottom: 16,
      fontFamily: "var(--font-display)"
    }
  }, c.h), c.items.map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      color: "var(--bow-gray-300)",
      fontSize: 14,
      marginBottom: 10
    }
  }, i)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontWeight: 700,
      marginBottom: 16,
      fontFamily: "var(--font-display)"
    }
  }, "Fale conosco"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--bow-gray-300)",
      fontSize: 14,
      marginBottom: 8
    }
  }, "+55 51 99584-3340"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--bow-gray-300)",
      fontSize: 14
    }
  }, "atendimento@agenciabow.com"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-subtle)",
      paddingTop: 24,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-bow-white.svg",
    style: {
      height: 18
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--bow-gray-500)",
      fontSize: 13
    }
  }, "\xA9 2026 Bow. Todos os direitos reservados.")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
function Header({
  dark = true
}) {
  const [open, setOpen] = React.useState(false);
  const color = dark ? "#fff" : "#111";
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 40px",
      background: dark ? "rgba(10,10,10,.7)" : "rgba(255,255,255,.9)",
      backdropFilter: "blur(10px)",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-bow-white.svg",
    alt: "bow.",
    style: {
      height: 22,
      filter: dark ? "none" : "invert(1)"
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => setOpen(!open),
    style: {
      color,
      cursor: "pointer",
      fontSize: 15,
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, "Solu\xE7\xF5es ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10
    }
  }, "\u25BE")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 32,
      left: -10,
      background: "var(--bow-black-elevated)",
      borderRadius: "var(--radius-md)",
      padding: 12,
      boxShadow: "var(--shadow-lg)",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      minWidth: 200
    }
  }, ["Consultoria e diagnóstico", "Estratégia digital", "Aquisição paga", "SEO e GEO", "Tecnologia, dados e IA"].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      color: "#fff",
      fontSize: 14,
      padding: "6px 10px",
      borderRadius: 8,
      cursor: "pointer"
    },
    onMouseEnter: e => e.currentTarget.style.background = "var(--bow-gray-800)",
    onMouseLeave: e => e.currentTarget.style.background = "transparent"
  }, s))), /*#__PURE__*/React.createElement("span", {
    style: {
      color,
      fontSize: 15,
      cursor: "pointer"
    }
  }, "Cases"), /*#__PURE__*/React.createElement("span", {
    style: {
      color,
      fontSize: 15,
      cursor: "pointer"
    }
  }, "Sobre"), /*#__PURE__*/React.createElement("span", {
    style: {
      color,
      fontSize: 15,
      cursor: "pointer"
    }
  }, "Blog")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      background: "transparent",
      border: `1px solid ${dark ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.2)"}`,
      color,
      borderRadius: "var(--radius-pill)",
      padding: "10px 20px",
      fontSize: 14,
      cursor: "pointer"
    }
  }, "Acesse o Muby"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--accent-gradient)",
      border: "none",
      color: "#fff",
      borderRadius: "var(--radius-pill)",
      padding: "10px 20px",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Fale com um Especialista")));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      minHeight: 640,
      display: "flex",
      alignItems: "flex-end",
      backgroundImage: "linear-gradient(180deg, rgba(10,10,10,.3), rgba(10,10,10,.92)), url(../../shots/mockup-ipad.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "80px 40px 64px",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--bow-green)",
      fontWeight: 700,
      letterSpacing: "var(--tracking-wide)",
      fontSize: 13,
      marginBottom: 12,
      textTransform: "uppercase"
    }
  }, "GROWTH"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      color: "#fff",
      fontWeight: 800,
      fontSize: "var(--text-display-1)",
      lineHeight: "var(--leading-tight)",
      letterSpacing: "var(--tracking-tight)",
      margin: "0 0 20px"
    }
  }, "IA e dados na sua ", /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--accent-gradient)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent"
    }
  }, "opera\xE7\xE3o de receita")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--bow-gray-300)",
      fontSize: "var(--text-body-lg)",
      maxWidth: 480,
      margin: "0 0 28px"
    }
  }, "Organizamos a opera\xE7\xE3o de quem quer crescer, com plano, tecnologia pr\xF3pria e decis\xE3o baseada em dados."), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--accent-gradient)",
      border: "none",
      color: "#fff",
      borderRadius: "var(--radius-pill)",
      padding: "16px 32px",
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Fazer o diagn\xF3stico")));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/LogoStrip.jsx
try { (() => {
function LogoStrip() {
  const logos = ["ikro", "topázio", "W!P", "AEL", "ATOM", "GESIF", "TENNARO", "Siemens"];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--bow-black)",
      padding: "40px 40px 64px",
      display: "flex",
      gap: 48,
      justifyContent: "center",
      flexWrap: "wrap"
    }
  }, logos.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      color: "var(--bow-gray-500)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: "0.02em"
    }
  }, l)));
}
window.LogoStrip = LogoStrip;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/LogoStrip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Method.jsx
try { (() => {
const steps = [{
  n: "001",
  t: "Diagnosticamos onde estão os gargalos e as oportunidades.",
  d: "Mapeamos seu cenário real: canais, funil, ferramentas e dados, pra entender o que trava e o que pode crescer."
}, {
  n: "002",
  t: "Desenhamos a estratégia sob medida pro seu negócio.",
  d: "Definimos a tese de crescimento, as metas por etapa e o plano de ação priorizado."
}, {
  n: "003",
  t: "Executamos com tecnologia própria e IA aplicada.",
  d: "Conteúdo, campanhas e dados vivem no mesmo lugar — sem retrabalho, com visibilidade total."
}];
function Method() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--bow-black)",
      padding: "0 40px 96px",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      background: "var(--accent-gradient)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: "var(--tracking-wide)",
      padding: "6px 16px",
      borderRadius: "var(--radius-pill)",
      marginBottom: 20,
      textTransform: "uppercase"
    }
  }, "Nosso m\xE9todo"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      color: "#fff",
      fontSize: "var(--text-display-2)",
      fontWeight: 700,
      maxWidth: 720,
      lineHeight: "var(--leading-tight)",
      margin: "0 0 48px"
    }
  }, "Unificamos dados, mensagens e IA pra cada decis\xE3o ser mais r\xE1pida e mais certa que a anterior."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-8)",
      display: "flex",
      gap: 24,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--accent-gradient)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 13,
      padding: "6px 14px",
      borderRadius: "var(--radius-pill)",
      flexShrink: 0
    }
  }, s.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#fff",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      marginBottom: 8
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--bow-gray-300)",
      fontSize: 14,
      lineHeight: "var(--leading-relaxed)"
    }
  }, s.d))))));
}
window.Method = Method;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Method.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/MubyShowcase.jsx
try { (() => {
function MubyShowcase() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--bow-black)",
      padding: "96px 40px",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 40,
      alignItems: "center",
      maxWidth: 1120,
      marginInline: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      background: "var(--accent-gradient)",
      color: "#fff",
      fontWeight: 700,
      fontSize: 12,
      padding: "6px 16px",
      borderRadius: "var(--radius-pill)",
      marginBottom: 20,
      textTransform: "uppercase"
    }
  }, "Muby"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      color: "#fff",
      fontSize: "var(--text-h1)",
      fontWeight: 700,
      margin: "0 0 16px"
    }
  }, "Tecnologia pr\xF3pria para transformar investimento em neg\xF3cios."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--bow-gray-300)",
      fontSize: 15,
      margin: "0 0 24px"
    }
  }, "O Muby \xE9 a plataforma propriet\xE1ria da Bow. Campanhas, funil, conte\xFAdo e dados vivem no mesmo lugar."), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "var(--accent-gradient)",
      border: "none",
      color: "#fff",
      borderRadius: "var(--radius-pill)",
      padding: "14px 28px",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Conhe\xE7a o Muby")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--accent-gradient)",
      borderRadius: "var(--radius-lg)",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0e0e0e",
      borderRadius: "var(--radius-md)",
      padding: 20,
      color: "#fff",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 16,
      color: "var(--bow-gray-300)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "Meta Ads"), /*#__PURE__*/React.createElement("span", null, "Atualizado 02/09")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      marginBottom: 8
    }
  }, "An\xE1lise do Muby IA"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--bow-gray-300)",
      lineHeight: 1.6
    }
  }, "Investimento subiu 16% com CTR em alta e CPC est\xE1vel. Recomenda\xE7\xE3o: priorizar formatos de v\xEDdeo pra ampliar engajamento.")))));
}
window.MubyShowcase = MubyShowcase;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/MubyShowcase.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Solutions.jsx
try { (() => {
const solutions = [{
  t: "Consultoria e diagnóstico",
  d: "Leitura da operação, apoio técnico e mentorias: dados, tecnologia, processos e gargalos operacionais.",
  icon: "✓"
}, {
  t: "Estratégia digital",
  d: "Tese de crescimento, metas por etapa e plano de ação priorizado por canal.",
  icon: "◎"
}, {
  t: "Aquisição paga",
  d: "Campanhas de performance com orçamento otimizado por dados em tempo real.",
  icon: "▲"
}, {
  t: "Branding",
  d: "Posicionamento e identidade visual que sustentam a operação de receita.",
  icon: "✦"
}, {
  t: "Vídeo",
  d: "Produção de conteúdo em vídeo para topo, meio e fundo de funil.",
  icon: "▶"
}];
function Solutions() {
  const [active, setActive] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "#fff",
      padding: "96px 40px",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      color: "#111",
      fontSize: "var(--text-h1)",
      fontWeight: 700,
      textAlign: "center",
      margin: "0 0 48px"
    }
  }, "Solu\xE7\xF5es pra cada gargalo e diagn\xF3stico."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 20,
      justifyContent: "center",
      flexWrap: "wrap"
    }
  }, solutions.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.t,
    onClick: () => setActive(i),
    style: {
      width: 190,
      height: 260,
      borderRadius: "var(--radius-lg)",
      padding: 24,
      cursor: "pointer",
      background: active === i ? "var(--accent-gradient)" : "transparent",
      border: active === i ? "none" : "1px solid var(--border-subtle-on-light)",
      color: active === i ? "#fff" : "#111",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "all var(--duration-normal) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22
    }
  }, s.icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 16
    }
  }, s.t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 40,
      maxWidth: 520,
      marginInline: "auto"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 20,
      fontWeight: 700,
      margin: "0 0 8px"
    }
  }, solutions[active].t), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-secondary-on-light)",
      fontSize: 15,
      margin: "0 0 20px"
    }
  }, solutions[active].d), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: "var(--radius-pill)",
      padding: "12px 28px",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "Ver solu\xE7\xE3o")));
}
window.Solutions = Solutions;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Solutions.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dialog = __ds_scope.Dialog;

})();
