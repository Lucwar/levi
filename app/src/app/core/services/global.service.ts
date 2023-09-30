import { EventEmitter, Injectable } from '@angular/core';
import { Settings } from '../../app.settings';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  // Variables solo para la maqueta
  public requestTaxiMode = false;

  public settings = Settings;

  public loadingBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public loading = false;

  public userBehaviorSubject: BehaviorSubject<boolean>;
  public user: User;

  public objects = {};
  public objectsBehaviorSubject = {};

  public actionsBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public actions: {[k: string]: any[]} = {};

  public menu: any;
  public menuBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject(false);

  public devicePlatform: any;

  public eventEmitter = new EventEmitter<any>();

  public pendingActions: [{[k: string]: any}[], {[k: string]: any}[]] = [[], []];
  public pendingActionsSubject: BehaviorSubject<{[k: string]: any}[]> = new BehaviorSubject(this.pendingActions);


  constructor() {
    this.loadUser();
    this.userBehaviorSubject = new BehaviorSubject(false);
  }

  addPendingAction(actions: any[], actionsToPerform: any[]) {
    this.pendingActions = [actions, actionsToPerform];
    this.pendingActionsSubject.next(this.pendingActions);
  }

  getPendingActions(): Observable<{[k: string]: any}[]> {
    return this.pendingActionsSubject.asObservable();
  }

  emit(event: { type: 'action' | 'event', payload: any, eventName?: string }) {
    this.eventEmitter.emit(event);
  }

  emitAction(payload: {[k: string]: any}) {
    this.emit({ type: 'action', payload });
  }

  emitEvent(eventName: string, payload: any[]) {
    this.emit({ type: 'event', eventName, payload });
  }

  // (+) User

  getToken(type: 'accessToken' | 'refreshToken'): string {
    const token = localStorage.getItem(this.settings.storage[type]);
    return token ? JSON.parse(token) : null;
  }

  setToken(type: 'accessToken' | 'refreshToken', token: string): string {
    localStorage.setItem(this.settings.storage[type], JSON.stringify(token));
    return token;
  }

  /**
   * Save user
   */
  saveUser({ accessToken, refreshToken, ...user }: any, stop = false): void {
    localStorage.setItem(this.settings.storage.user, JSON.stringify(user));
    
    this.user = user;
    
    if (refreshToken) this.setToken('refreshToken', refreshToken);
    if (accessToken) this.setToken('accessToken', accessToken);
    
    if (stop) return;
    this.userBehaviorSubject.next(true);
  }

  /**
   * Get user
   */
  getUser(): User {
    return this.user;
  }

  /**
   * Remove user
   */
  removeUser(): void {
    localStorage.removeItem(this.settings.storage.user);
    localStorage.removeItem(this.settings.storage.refreshToken);
    localStorage.removeItem(this.settings.storage.accessToken);
    this.user = null;
    this.userBehaviorSubject.next(false);
  }

  /**
   * Get observable
   */
  getUserAsObservable(): Observable<boolean> {
    return this.userBehaviorSubject.asObservable();
  }

  /**
   * Check user
   */
  checkUser(): User {
    this.userBehaviorSubject.next(!!this.loadUser());
    return this.user;
  }

  /**
   * Load user
   */
  loadUser(): User {
    const user = localStorage.getItem(this.settings.storage.user);
    
    this.user = user ? JSON.parse(user) : null;
    
    return this.user;
  }
  // (-) User


  // (+) Generic objects

  /**
   * Save object
   */
  save(key: string, object: {[k: string]: any}): void {
    localStorage.setItem(key, JSON.stringify(object));
    this.objects[key] = object;
    
    this.objectsBehaviorSubject[key]
    ? this.objectsBehaviorSubject[key].next(true)
    : this.objectsBehaviorSubject[key] = new BehaviorSubject(true);
  }

  /**
   * Get object
   */
  get(key: string) {
    return this.objects[key];
  }

  /**
   * Get object
   */
  exists(key: string): boolean {
    return this.objects[key] ? true : false;
  }

  /**
   * Remove object
   */
  remove(key: string): void {
    localStorage.removeItem(key);
    delete this.objects[key];
    if (this.objectsBehaviorSubject[key]) this.objectsBehaviorSubject[key].next(false);
  }

  /**
   * Get object as observable
   */
  getAsObservable(key: string): Observable<any> {
    if (!this.objectsBehaviorSubject[key]) this.objectsBehaviorSubject[key] = new BehaviorSubject(true);

    return this.objectsBehaviorSubject[key].asObservable();
  }

  /**
   * Check object
   */
  check(key: string) {
    const exists = this.load(key) ? true : false;

    this.objectsBehaviorSubject[key]
    ? this.objectsBehaviorSubject[key].next(exists)
    : this.objectsBehaviorSubject[key] = new BehaviorSubject(exists);

    return this.objects[key];
  }

  /**
   * Load object
   */
  load(key: string) {
    const item = localStorage.getItem(key);

    item
    ? this.objects[key] = JSON.parse(item)
    : delete this.objects[key];
      
    return this.objects[key];
  }

  /**
   * Pop
   */
  pop(key: string) {
    const item = this.load(key);
    
    this.remove(key);

    return item;
  }


  // (-) Generic objects


  // (+) Loading

  /**
   * Show
   */
  showLoading() {
    this.loading = true;
    this.loadingBehaviorSubject.next(true);
  }

  /**
   * Show
   */
  hideLoading() {

    this.loading = false;
    this.loadingBehaviorSubject.next(false);
  }

  /**
   * Is showing
   */
  isLoading() {
    return this.loading;
  }

  /**
   * Get loading observable
   */
  getLoadingAsObservable(): Observable<any> {
    return this.loadingBehaviorSubject.asObservable();
  }

  // (-) Loading


}
