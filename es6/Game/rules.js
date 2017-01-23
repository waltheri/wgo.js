// preset rule sets

export const JAPANESE_RULES = {
	checkRepeat: "KO",
	allowRewrite: false,
	allowSuicide: false
}

export const CHINESE_RULES = {
	checkRepeat: "ALL",
	allowRewrite: false,
	allowSuicide: false
}

export const ING_RULES = {
	checkRepeat: "ALL",
	allowRewrite: false,
	allowSuicide: true
}

export const NO_RULES = {
	checkRepeat: "NONE",
	allowRewrite: true,
	allowSuicide: true
}

export default {
	"Japanese": JAPANESE_RULES,
	"GOE": ING_RULES,
	"NZ": ING_RULES,
	"AGA": CHINESE_RULES,
	"Chinese": CHINESE_RULES
}
