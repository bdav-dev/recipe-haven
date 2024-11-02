import { Unit } from "@/types/MiscellaneousTypes"

export function unitToString(unit: Unit) {
    switch (+unit) {
        case Unit.GRAMM: return "Gramm"
        case Unit.LITER: return "Liter"
        case Unit.PIECE: return "Stück"
    }
}