import {LitElement, customElement, property, html, css} from 'lit-element'

export class CustomDial extends LitElement {
    @property()
    min: number = 0
    @property()
    max: number = 10
    @property()
    value: number = 5
    @property()
    step: number = 1

    render() {
        return html`
        <input class="numbah" type="number" value=${this.value}>
        <input type="range" min="${this.min}", max="${this.max}", step=${this.step}
        @input=${(e:InputEvent)=>{this.value = parseInt((<HTMLInputElement>e.target).value)}}
        >
        `
    }

    get css() {
        return css`
        .numbah {
            width:10px;
        }
        `
    }
}
customElements.define('exalted-dial', CustomDial)