import {LitElement, customElement, property, html, css} from 'lit-element'

@customElement("toggle-bar") 
export class ToggleBar extends LitElement {
    @property()
    selected: string = ""
    

    firstUpdated() {
        this.select(this.selected)
    }
    get handle_toggle_click() {
        return (e: CustomEvent<ToggleOption>) => {
            // @ts-ignore
            this.selected = e.detail.name
            this.select()
            let ev = new ToggleChangeEvent(e.detail.name)
            this.dispatchEvent(ev)
        }
    }
    select(name:string = this.selected) {
        this.selected = name
        let toggleit = (n:ToggleOption) => {
            n.selected = n.name === this.selected
        }
        Array.from(this.children).forEach(e=> {
            if (name in e) {
                toggleit(<ToggleOption>e)
            } else {
                // @ts-ignore
                Array.from(e.children).forEach(toggleit)
            }
        })
    }
    render() {
        return html`
        ${console.log(this.children)}
        <slot @toggle-bar-click=${this.handle_toggle_click}></slot>
        `
    }
}

export class ToggleChangeEvent extends Event {
    constructor(name:string) {
        super('toggle-change')
        this.name = name
    }
    name:string
}

@customElement("toggle-option")
export class ToggleOption extends LitElement {
    @property()
    name=""
    @property()
    selected=false
    part="toggle-option"
    get handle_click() {
        return (e:Event) => {
            let myEvent = new CustomEvent('toggle-bar-click', { 
                detail: this,
                bubbles: true, 
                composed: true });
            this.dispatchEvent(myEvent);
        }
    }
    render() {
        return html`
        <button part="button" class="${this.selected ? 'selected' : 'notselected'}" @click=${this.handle_click}>
            <slot></slot>
        </button>
        `
    }
    static get styles() {
        return css`
            button {
                font-family: inherit;
                min-width: 10vw;
                height: 10vw;
            }
            .selected {
                background: red;
            }
        `
    }
}

@customElement("toggle-group")
export class ToggleGroup extends LitElement {
    @property()
    label=""
    @property()
    options=Array.from(this.children)

    render() {
        return html`
            <div id="container">
    <label>${this.label}</label>
                <slot>
            </div>
        `
    }

    static get styles() {
        return css`
            label {
                display: block;
                width: 100%;
                text-align: center;
            }
            div#container {
                display: inline-block;
                padding: 10px;
            }


        `
    }
}