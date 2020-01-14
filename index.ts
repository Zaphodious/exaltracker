import {LitElement, customElement, property, html, css} from 'lit-element'
import './exalted-dial'
import {DialUpdateEvent} from './exalted-dial'
import 'input-knob'
import './toggle-bar'
import {ToggleChangeEvent} from './toggle-bar'

type EssenceTuple = [number, number]
type EssenceRange = [EssenceTuple, EssenceTuple, EssenceTuple, EssenceTuple, EssenceTuple, EssenceTuple, ]
// @ts-ignore

@customElement("exalted-sliders")
class ExaltedSliders extends LitElement {
    @property()
    essence_rating = 1
    @property()
    personal_essence = 10
    @property()
    peripheral_essence = 10
    @property()
    committed_essence = 10
    @property()
    max_willpower = 10
    @property()
    temp_willpower = 10
    @property()
    anima_level = 1
    @property()
    selected = "peripheral_essence"
    @property()
    splat_type = 'Solar'

    get handle_dial_update() {
        return (e:DialUpdateEvent) => {
            // @ts-ignore
            this[this.selected] = e.dial.value
        }
    }

    get handle_select_change() {
        return (e:InputEvent) => {
            this.splat_type = (<HTMLOptionElement>e.target)?.value
            console.log(this.splat_type)
        }
    }

    render() {
        // @ts-ignore
        let estypes = Array.from(essence_values).map(([k])=>html`<option value="${k}">${k}</option>`)
        let minmax = this.get_min_and_max(this.selected)
        // @ts-ignore
        let value:number = this[this.selected]
        return html`
        <select @change=${this.handle_select_change}>
            ${estypes}
        </select>
        <toggle-bar selected="${this.selected}" @toggle-change=${(e:ToggleChangeEvent)=>this.selected = e.name}>
            <toggle-group label="Essence">
                ${this.toggle_option("Rating", "essence_rating")}
                ${this.toggle_option("Personal", "personal_essence")}
                ${this.toggle_option("Peripheral", "peripheral_essence")}
                ${this.toggle_option("Committed", "committed_essence")}
            </toggle-group>
            <toggle-group label="Willpower">
                ${this.toggle_option("Max", "max_willpower")}
                ${this.toggle_option("Temp", "temp_willpower")}
            </toggle-group>
            <toggle-group label="Anima">
            ${this.toggle_option("Level", "anima_level")}
            </toggle-group>
        </toggle-bar>
        <exalted-dial 
            min="${minmax.min}" 
            max="${minmax.max}" 
            value="${value}"
            @dial-update=${this.handle_dial_update}></exalted-dial>
        `
    }
        
    toggle_option(label:string, name:string){
        // @ts-ignore
        let value = this[name]
        return html`
            <toggle-option name="${name}"><span>${label}</span> <span>${value}</span></toggle-option>
        `
    }

    get total_max_periph() {
        let ess = essence_values.get(this.splat_type) || []
        return (ess[this.essence_rating] || [])[1]
    }
    get total_max_personal() {
        let ess = essence_values.get(this.splat_type) || []
        return (ess[this.essence_rating] || [])[0]
    }
    

    get_min_and_max(name:string) {
        let ret = {min: 0, max: 0}
        switch(name) {
            case "essence_rating":
                ret={min:1, max:5}
                break;
            case "anima_level":
                ret={min:1, max:3}
                break;
            case 'max_willpower': 
                ret={min:0, max: 15}
                break
            case 'temp_willpower':
                ret={min:0, max:this.max_willpower}
                break
            case 'peripheral_essence':
                ret={min:0, max:(this.total_max_periph - this.committed_essence)}
                break
            case 'personal_essence':
                ret={min:0, max:(this.total_max_personal)}
                break
            case 'committed_essence':
                ret={min:0, max:this.total_max_periph}
                break
        }
        return ret
    }

    static get styles() {
        return css`
        * {
            text-align: center;
            margin: 0 auto;
            font-family: sans-serif;
        }
        span {
            display: block;
        }
        select {
            display: block;
            width: 100%;
            text-align-last: center;
        }
        `
    }
}

let essence_values = new Map<string, EssenceRange>([
    ["Solar",       [ [10, 0], [13, 33], [16, 40], [19, 47], [22, 54], [25, 61] ]],
    ["Terrestrial", [ [10, 0], [12, 27], [13, 31], [14, 35], [15, 39], [15, 43] ]],
    ["Sidereal",    [ [10, 0], [11, 31], [13, 37], [15, 43], [17, 49], [19, 55] ]],
    ["Liminal",     [ [10, 0], [13, 27], [16, 31], [19, 35], [22, 39], [25, 43] ]],
    ["Lunar",       [ [10, 0], [13, 31], [13, 37], [15, 43], [17, 49], [19, 55] ]]
])
console.log(essence_values)