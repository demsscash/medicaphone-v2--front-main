import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable, Injector } from "@angular/core";
import { ToastComponent } from "../../shared/components/toast/toast.component";

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastComponentRefs: ComponentRef<ToastComponent>[] = [];

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector
  ) {}

  show(message: string, type: 'success' | 'error') {
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.environmentInjector,
    });

    componentRef.instance.message = message;
    componentRef.instance.type = type;

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.toastComponentRefs.push(componentRef);

    setTimeout(() => {
      this.destroyToast(componentRef);
    }, 3000);
  }

  private destroyToast(componentRef: ComponentRef<ToastComponent>) {
    const index = this.toastComponentRefs.indexOf(componentRef);
    if (index !== -1) {
      this.toastComponentRefs.splice(index, 1); 
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy(); 
    }
  }
}