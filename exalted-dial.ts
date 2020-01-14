import {LitElement, customElement, property, html, css} from 'lit-element'

export class DialUpdateEvent extends Event {
    constructor(dial: ExaltedDial) {
        super('dial-update')
        this.dial = dial
    }
    dial: ExaltedDial
}

interface ElementEventMap {
    'dial-update': DialUpdateEvent;
}

@customElement('exalted-dial')
export class ExaltedDial extends LitElement {
    @property()
    min: number = 0
    @property()
    max: number = 10
    @property()
    value: number = 5
    @property()
    step: number = 1
    @property()
    label: string = ""
    @property()
    dial_value = 0
    spinning = false


    get applyIntValue() {
        return (e: InputEvent) => {
            let newvalue = parseInt((<HTMLInputElement>e.target).value)
            if (newvalue != this.value) {
                this.value = newvalue
                window.navigator.vibrate(20)
            }
            let event = new DialUpdateEvent(this);
            this.dispatchEvent(event)

        }
    }

    render() {
        return html`
        <div>
            <label for="numbah">${this.label}</label>
            <div>${this.min} to ${this.max}</div>
            <input id="numbah" type="number" value=${this.value} @input=${this.applyIntValue}>
            <input-knob min="${this.min}" max="${this.max}" value="${this.spinning ? this.dial_value : this.value}" step=${this.step} scale=${this.max}
             @knob-move-change=${this.applyIntValue}
             @knob-move-start=${(e:Event)=>this.spinning=true}
             @knob-move-end=${(e:Event)=>this.spinning=false}
             >
                <div class="mark">▲</div>
            </input-knob>
        </div>
        `
    }

    static get styles() {
        return css`
        * {
            --totalwidth: 70vw;
        }
        input[type="number"] {
            width: calc(var(--totalwidth)/2);
            display: block;
            margin: auto;
            text-align: center;
        }
        label {
            display: block;
        }
        span {
            display: inline;
        }
        input-knob {
            width: var(--totalwidth);
            height: var(--totalwidth);
            margin: auto;
            display: block;
            border-radius: 100%;
            box-shadow: 0 0.3rem 0.3rem rgba(0, 0, 0, 0.5);
            background: #cadbbc;
          }
          
          input-knob::part(rotator) {
            box-sizing: border-box;
            width: var(--totalwidth);
            height: var(--totalwidth);
            background: #cadbbc;
            border: 1rem double #356211;
            border-bottom: 1rem solid #356211;
            border-top: 1rem none #356211;
            border-radius: 100%;
          }
        
        .mark {
            display: inline-block;
            width: 100%;
            text-align: center;
            font: bold 200% monospace;
            color: blue;
        }
        `
    }
}

function range(val = 10) {
    return [...(new Array(val)).keys()]
}