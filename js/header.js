/* eslint-disable @typescript-eslint/no-unused-vars */

class EventHandler {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  unsubscribe(eventName, callback) {
    if (this.events[eventName]) {
      var filteredCallbacks = [];
      for (var i = 0; i < events[eventName].length; i++) {
        if (events[eventName][i] !== callback) {
          filteredCallbacks.push(events[eventName][i]);
        }
      }
      events[eventName] = filteredCallbacks;
    }
  }

  publish(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => cb(data));
    }
  }
}

const eventHandler = new EventHandler();

let registeredElements = [...document.querySelectorAll('[register-action]')];
registeredElements.forEach((element) => {
  const ELEMENT_ACTION = element.getAttribute('register-action');
  element.addEventListener('click', (event) =>
    eventHandler.publish(ELEMENT_ACTION, event)
  );
});

// ---------------

class BottomSheetController {
  constructor(bottomSheetID) {
    this.bottomSheet = document.getElementById(bottomSheetID);
    // Establece el boton padre que maneja el bottomsheet
    this.handlerButton = document.querySelector(
      `[data-target=${bottomSheetID}]`
    );
  }

  toggle() {
    utils.dom.toggleBooleanAttribute(this.bottomSheet, 'aria-hidden');
  }
}

class BackshadowController {
  constructor(focusElement, handlerFocusElement) {
    this.focusElement = focusElement;
    this.handlerFocusElement = handlerFocusElement;

    // almacena el backshadow si ya está creado
    this._backshadowElement = document.getElementById(
      `backshadow-${this.focusElement.id}`
    );

    if (!this._backshadowElement) {
      // Procede con la creación del backshadow
      const backshadowElement = document.createElement('div');
      backshadowElement.setAttribute(
        'id',
        `backshadow-${this.focusElement.id}`
      );
      backshadowElement.setAttribute('data-dismiss', this.focusElement.id);
      backshadowElement.classList.add('backshadow');
      this.focusElement.parentNode.append(backshadowElement);
      this._backshadowElement = backshadowElement;
    }
  }

  show() {
    setTimeout(() => {
      this._backshadowElement.classList.add('show');
    }, 1);
    this._backshadowElement.addEventListener('click', (event) => {
      eventHandler.publish(this.handlerFocusElement, event);
    });
  }

  destroy() {
    this._backshadowElement.classList.remove('show');
    setTimeout(() => {
      this._backshadowElement.remove();
    }, 200);
  }
}

class OffCanvasController {
  constructor(offCanvasID) {
    this.offCanvas = document.getElementById(offCanvasID);
    // Establece el boton padre que maneja el bottomsheet
    this.handlerButton = document.querySelector(`[data-target=${offCanvasID}]`);
  }

  toggle() {
    utils.dom.toggleBooleanAttribute(this.offCanvas, 'aria-hidden');
  }
}

// ---------------

const utils = {};
utils.dom = utils.dom || {};
utils.dates = utils.dates || {};
utils.modyo = utils.modyo || {};

/** @param {HTMLElement} element - elemento al que se quiere cambiar la propiedad aria-expanded */
utils.dom.toggleBooleanAttribute = (element, attribute) => {
  // @type {boolean}
  const aria_expanded = element.getAttribute(attribute) === 'true';
  element.setAttribute(attribute, !aria_expanded);
  return aria_expanded;
};

/** Obtiene los días transcurridos desde una cierta fecha
 * @param {string} date - Fecha de inicio
 */
utils.dates.daysElapsedSince = (date) => {
  const today = new Date();
  const dateFormatted = new Date(date);
  const diff_ms = today.getTime() - dateFormatted.getTime();
  const daysElapsed = Math.floor(diff_ms / 86400000);

  return daysElapsed;
};

utils.modyo.changeLinksEnvironment = (root_element) => {
  const linksOfRootNode = root_element.querySelectorAll('a');
  // extrae el entorno, ej: 'dev-nsp-dev-cert'
  const env = 'empresas'.includes('cert') ? 'empresascert' : 'empresas';
  linksOfRootNode.forEach(linkElement => {
    const href = linkElement.getAttribute('href');
    // site.account_url -> https://ww2.itau.cl/
    if (href.includes('https://ww2.itau.cl')) {
      // si ya tiene el ambiente correcto no hacer nada
      if (href.includes(env)) return;
      const linkEnvironment = (href.split('https://ww2.itau.cl')[1]).split('/')[1];
      if ('empresas'.includes('cert')) {
        var newHost = href.replace(linkEnvironment, `${env}-${linkEnvironment}`);
      } else {
        var newHost = href;
      }
      linkElement.setAttribute('href', newHost);
    }


    if ('empresas'.includes('cert')) {
      if (href.includes('banco.itau.cl')) {
        const newHost = href.replace('banco.itau.cl', 'portalqa.itauchile2.cl');
        linkElement.setAttribute('href', newHost);
      }
    }
  });
};

// -----------------

// Main Thread

const MAX_BADGES_PER_CATEGORY = 3;

document.addEventListener('DOMContentLoaded', () => {
  /** Alternador de ambientes - Kevin Castillo
    * En el sitio público se manejan 4 ambientes (dev-nsp, dev, cert, main)
    * Los cuales se diferencian el el host del sitio, por ejemplo,
    * ambiente dev-nsp : 'https://ww2.itau.cl/dev-nsp-dev-cert-personas'
    * El problema es que para algunos desarrollos en certificación se necesita 
    * acceso en el ambiente actual.
    * Este script no afecta a la rama productiva debido a que los links cargados 
    * en Modyo ya apuntan a producción, lo que hace este script es 
    * cambiar el entorno de producción a dev-nsp, dev, o cert según se requiera
    * de manera automática.
    */


  const menuCanvasElement = document.getElementById('nuevo-menu');
  const bottomFixElement = document.getElementById('bottom_fix');
  const bottomSheetElement = document.getElementById('segmentBottomSheet');
  const segmentSearchSheetElement = document.getElementById('segmentSearchSheet');

  utils.modyo.changeLinksEnvironment(menuCanvasElement);
  utils.modyo.changeLinksEnvironment(bottomFixElement);
  utils.modyo.changeLinksEnvironment(bottomSheetElement);
  utils.modyo.changeLinksEnvironment(segmentSearchSheetElement);

  // ------


  const tag_cadence = Number(30);

  const badgeElements = document.querySelectorAll('.offCanvas-slot .badge');
  badgeElements.forEach((badge) => {
    const creationDate = badge.getAttribute('tag-creation') || undefined;
    if (!creationDate) return;
    const daysElapsed = utils.dates.daysElapsedSince(creationDate);
    if (daysElapsed > tag_cadence) badge.remove();
  });

  const categories = document.querySelectorAll('.offCanvas-sheet.second-level');
  categories.forEach((category) => {
    const badges = [...category.querySelectorAll('.badge')];
    badges
      .map((badge) => {
        return {
          badge: badge,
          creation: badge.getAttribute('tag-creation'),
        };
      })
      .sort((a, b) => new Date(b.creation) - new Date(a.creation))
      .slice(0, MAX_BADGES_PER_CATEGORY)
      .forEach((badge) => (badge.badge.style.display = 'initial'));
  });
});

// -----------------

eventHandler.subscribe('toggle_offCanvas', (event) => {
  const trigger = event.currentTarget;
  const offCanvasID =
    trigger.getAttribute('data-target') || trigger.getAttribute('data-dismiss');
  const offCanvasHandler = new OffCanvasController(offCanvasID);

  // Establece el opacity en 0 cuando el offCanvas se encuentra cerrado
  // esto para que cuando se haga un resize de la pantalla no se muestre
  // yendo de lado a lado.
  // Como todo clickeable que tenga acción de 'cierre' tiene que contener
  // el atributo data-dismiss, evaluamos si es un evento de cierre.
  const isCloseEvent =
    !!event.currentTarget.getAttribute('data-dismiss') ||
    event.currentTarget.getAttribute('aria-expanded') === 'true';
  if (isCloseEvent) {
    setTimeout(() => {
      // Establece el timeout para que se ejecuten todas las animaciones
      // presentes al momento de cerrar el offCanvas.
      offCanvasHandler.offCanvas.style.opacity = 0;

      // Al momento de cerrar el offCanvas se desea que cuando se vuelva
      // a abrir muestre el inicio del menú y no donde el usuario lo dejó.
      eventHandler.publish('offcanvas-goback', event);
    }, 350);
  } else {
    // cuando el evento sea de apertura...
    offCanvasHandler.offCanvas.style.opacity = 1;
  }

  offCanvasHandler.toggle();

  // Se hace el toggle del atributo aria-expanded para poder
  // cambiar el sentido del chevron y otorgar mayor accesibilidad.
  utils.dom.toggleBooleanAttribute(
    offCanvasHandler.handlerButton,
    'aria-expanded'
  );

  eventHandler.publish('backshadow', {
    // FIX: Volver esto dinámico.
    focus_element: document.getElementById('MenuOffCanvas'),
    handler_focus_element: event.currentTarget.getAttribute('register-action'),
  });
});

eventHandler.subscribe('toggle_bottomsheet', (event) => {
  /** Declaramos la constante trigger para poder conocer el id del
   * bottomsheet que se estará manejando, existen dos opciones para
   * poder lograrlo, la primera es que el trigger sea el botón primario,
   * en este caso el id del bottomsheet se obtiene con el atributo data-target,
   * en caso de que sea un botón que no necesariamente lo abre y cierra
   *  (como botón de close), este se puede obtener con el atributo data-dismiss.
   */
  /**@type {HTMLElement} trigger */
  const trigger = event.currentTarget;


  const bottomSheetID =
    trigger.getAttribute('data-target') || trigger.getAttribute('data-dismiss');
  const bottomSheetHandler = new BottomSheetController(bottomSheetID);

  bottomSheetHandler.toggle();

  // Se hace el toggle del atributo aria-expanded para poder
  // cambiar el sentido del chevron y otorgar mayor accesibilidad.
  utils.dom.toggleBooleanAttribute(
    bottomSheetHandler.handlerButton,
    'aria-expanded'
  );

  const hasBackshadow =
    bottomSheetHandler.bottomSheet.getAttribute('data-backshadow') === 'true';

  if (hasBackshadow) {
    eventHandler.publish('backshadow', {
      focus_element: bottomSheetHandler.bottomSheet,
      handler_focus_element:
        event.currentTarget.getAttribute('register-action'),
    });
  }
});

eventHandler.subscribe('backshadow', (data) => {
  /** data es un objeto con las siguientes propiedades
   * focus_element: indica el elemento que se está enfocando.
   */

  // comprobar si el componente se abre o se cierra
  const isFocusElementOpen =
    data.focus_element.getAttribute('aria-hidden') !== 'true';

  const backshadow = new BackshadowController(
    data.focus_element,
    data.handler_focus_element
  );

  // Establece el body en no scroll cuando exista más de un backdrop
  const elBody = document.querySelector('body');
  const hasMultipleBackshadows =
    document.querySelectorAll('.backshadow').length > 1;


  if (isFocusElementOpen || hasMultipleBackshadows) {
    elBody.classList.add('body-overflow-hidden');
    data.focus_element.classList.add('offcanvas-overflow-scroll');
  } else {
    elBody.classList.remove('body-overflow-hidden');
    data.focus_element.classList.remove('offcanvas-overflow-scroll');
  }

  if (isFocusElementOpen) {
    backshadow.show();
  } else {
    backshadow.destroy();
  }
});

// Este evento se encargará de mover las hojas del offCanvas
eventHandler.subscribe('move_sheets', (event) => {
  const firstLevelSheet = document.querySelectorAll(
    '.offCanvas-sheet.first-level'
  );

  firstLevelSheet.forEach((el) => el.setAttribute('aria-hidden', true));

  const selectedSheetID = event.currentTarget.getAttribute('data-target');
  const selectedSheet = document.getElementById(selectedSheetID);

  selectedSheet.setAttribute('aria-hidden', false);
});

eventHandler.subscribe('offcanvas-goback', (_) => {
  // Muestra la hoja principal o primaria.
  const firstLevelSheet = document.querySelectorAll(
    '.offCanvas-sheet.first-level'
  );
  firstLevelSheet.forEach((el) => el.setAttribute('aria-hidden', false));

  // Oculta cualquier hoja secundaria que este visible.
  const secondaryLevels = document.querySelectorAll(
    '.offCanvas-sheet:not(.first-level)'
  );
  secondaryLevels.forEach((sheet) => sheet.setAttribute('aria-hidden', true));
});

eventHandler.subscribe('toggle_searchsheet', (event) => {

  /** Declaramos la constante trigger para poder conocer el id del
   * bottomsheet que se estará manejando, existen dos opciones para
   * poder lograrlo, la primera es que el trigger sea el botón primario,
   * en este caso el id del bottomsheet se obtiene con el atributo data-target,
   * en caso de que sea un botón que no necesariamente lo abre y cierra
   *  (como botón de close), este se puede obtener con el atributo data-dismiss.
   */
  /**@type {HTMLElement} trigger */
  const trigger = event.currentTarget;

  const bottomSheetID =
    trigger.getAttribute('data-target') || trigger.getAttribute('data-dismiss');
  const bottomSheetHandler = new BottomSheetController(bottomSheetID);

  bottomSheetHandler.toggle();

  // Se hace el toggle del atributo aria-expanded para poder
  // cambiar el sentido del chevron y otorgar mayor accesibilidad.
  utils.dom.toggleBooleanAttribute(
    bottomSheetHandler.handlerButton,
    'aria-expanded'
  );

  const hasBackshadow =
    bottomSheetHandler.bottomSheet.getAttribute('data-backshadow') === 'true';

  if (hasBackshadow) {
    eventHandler.publish('backshadow', {
      focus_element: bottomSheetHandler.bottomSheet,
      handler_focus_element:
        event.currentTarget.getAttribute('register-action'),
    });
  }
});


// Se desea que en dispositivos tablet, cuando el offCanvas esté abierto
// y se de click sobre el segment switcher (dropdown de cambio de segmento)
// este se oculte automáticamente.
const dropdown = document.getElementById('buttonDropdownSegmentSwitch');
dropdown.addEventListener('click', (event) => {
  // El comportamiento nativo del dropdown no se encuentra en este fichero
  // debido a que se utiliza Bootstrap 4.X,
  // consultar: https://getbootstrap.com/docs/4.0/components/dropdowns/

  const offCanvas = document.getElementById('MenuOffCanvas');
  const isOffCanvasOpen = offCanvas.getAttribute('aria-hidden') === 'false';

  // Cierra el offCanvas si está visible
  if (isOffCanvasOpen) {
    eventHandler.publish('toggle_offCanvas', event);
  }
});

$('.category-product').on('click', (event) => {
  const offCanvas = document.getElementById('MenuOffCanvas');
  const isOffCanvasOpen = offCanvas.getAttribute('aria-hidden') === 'false';

  // Cierra el offCanvas si está visible
  if (isOffCanvasOpen) {
    eventHandler.publish('toggle_offCanvas', event);
  }
});


function event_name_header(item) {
  var tag_html = item.closest("#itau-header");
  if (tag_html) {
    return 'header';
  }
  return false;
}

function event_name_footer(item) {
  var tag_html = item.closest('footer');
  if (tag_html) {
    return 'footer';
  }
  return false;
}

function event_name_attribute(item) {
  var tag_html = item.closest('[data-event-name]');
  if (tag_html) {
    var event_name = tag_html.dataset.eventName;
    return event_name;
  }
  return false;
}

function event_name_path() {
  var path = document.location.pathname;
  path = path.replace('/personas', '');

  if (path.length > 1) {
    var path_array = path.split('/');
    var new_path = path_array[1].replace('/-/g', ' ');
    var new_path_up = new_path.charAt(0).toUpperCase().concat(new_path.slice(1));
    return (new_path.charAt(0).toUpperCase().concat(new_path.slice(1)));
  } else {
    return ('Home');
  }
}

function event_name_map(key) {
  var map1 = new Map();
  map1.set('header', 'Menú Principal');
  map1.set('home', 'Página Home');
  map1.set('footer', 'Footer');
  if (map1.has(key)) {
    var label = map1.get(key);
    return label;
  } else
    return key;
}

function event_action_type(item) {
  var type = "link";

  var type_tag = item.closest('[data-type]');

  if (type_tag) {
    type = type_tag.dataset.type;
  } else {
    var role_type = item.getAttribute("role");
    if (role_type) {
      if (role_type.includes("tab")) {
        type = "tab";
      }
    }
  }
  return type;
}

function event_action_section_map(key) {
  var map1 = new Map();
  map1.set('Sin clasificar', 'Sin clasificación');
  map1.set('home-page', 'Ir al Home');
  map1.set('grid-full', 'Hero');
  if (map1.has(key)) {
    var label = map1.get(key);
    return label.trim();
  } else
    return key;
}

function event_action_category(item) {
  var tag_html = item.closest('[data-content-category]');
  if (tag_html) {
    var contentCategory = tag_html.dataset.contentCategory;
    return contentCategory;
  }
  return false;
}

function event_action_section(item) {
  var section = 'Sin clasificar';
  var header_html = item.closest("#itau-header");
  var footer_html = item.closest('footer');
  var tag_html = item.closest('section');

  if (header_html) {
    section = 'header';
  }
  if (footer_html) {
    section = 'footer';
  }

  if (tag_html) {
    var id = tag_html.id;
    if (id) {
      section = id;
    }
  }
  section = event_action_section_map(section);
  section = section.replace(/-/g, ' ');
  return section.trim();
}

function event_label(item) {
  var label = item.innerText;
  var ariaLabel = item.ariaLabel;
  var contentName_tag = item.closest('[data-content-name]');

  if (contentName_tag) {
    var contentName = contentName_tag.dataset.contentName;
    label = contentName;
  } else {
    if (ariaLabel) {
      label = ariaLabel;
    }
  }

  return label.trim();
}

/////////// variables de GA Universal
function a_ga_category(item) {
  var ga_category = "Sin clasificar";
  var name_attribute = event_name_attribute(item);
  var name_header = event_name_header(item);
  var name_footer = event_name_footer(item);
  var name_path = event_name_path(item);

  if (name_attribute) {
    ga_category = name_attribute;
  } else {
    if (name_header || name_footer) {
      if (name_header) {
        ga_category = name_header;
      }
      if (name_footer) {
        ga_category = name_footer;
      }
    } else {
      ga_category = name_path;
    }
  }
  ga_category = event_name_map(ga_category);
  return ga_category.trim();
}

function a_ga_action(item) {
  var ga_action = '';
  var action_section = event_action_section(item);
  var action_type = event_action_type(item);
  var action_category = event_action_category(item);

  if (action_type) {
    ga_action = ga_action.concat(action_type);
  }

  if (action_category) {
    ga_action = ga_action.concat('(', action_category, ')');

  }

  if (action_section) {
    ga_action = ga_action.concat(' | ', action_section);
  }

  return ga_action.trim();
}

function a_ga_label(item) {
  var event_label_text = event_label(item);
  if (!event_label_text) {
    event_label_text = '';
    var header_html = item.closest("#itau-header");
    var footer_html = item.closest('footer');
    var item_id = item.id;
    var item_className = item.className;
    var item_href = item.href;
    var item_path = event_name_path(item);
    if (item_path) {
      if (header_html || footer_html) {
        if (header_html) {
          event_label_text = event_label_text.concat('header');
        }
        if (footer_html) {
          event_label_text = event_label_text.concat('footer');
        }
      } else {
        event_label_text = event_label_text.concat('(page:', item_path, ')');
      }
    }
    if (item_id) {
      event_label_text = event_label_text.concat('(id:', item_id, ')');



    } else {
      if (item_className) {
        event_label_text = event_label_text.concat('(class:', item_className, ')');
      }
      if (item_href) {
        event_label_text = event_label_text.concat('(href:', item_href, ')');
      }
    }
  }

  return event_label_text.trim();
}

/////// end Principales
function event_dataLayer(item) {
  var tag_html = item.closest('[data-layer]');
  if (tag_html) {
    var event_name = tag_html.dataset.layer;
    return event_name;
  }
  return false;
}

/////////////////////////////////////////////////// ==================//////////////////////////////

function ga_review() {

  function ga_review_all(item, index) {
    var category = a_ga_category(item);
    var action = a_ga_action(item);
    var label = a_ga_label(item);
    var print_log = "";
    print_log = print_log.concat(category);
    print_log = print_log.concat(' ; action:');

    print_log = print_log.concat(action);
    print_log = print_log.concat(' ; label:');
    print_log = print_log.concat(label);
    console.log(index, print_log);
  }
  var find_a = document.querySelectorAll('a');
  var find_b = document.querySelectorAll('button');

  console.log("\n\n Resumen de Tageo Google Analytics Universal");
  console.log("\n\n==> Link <a>");
  find_a.forEach(ga_review_all);
  console.log("\n\n==> Botones <button>");
  find_b.forEach(ga_review_all);

}

/////////////////////////////////////////////////// ==================//////////////////////////////

function gtm_section() {
  var section_without_id = 0;
  var contador = 0;

  function check_a(item, index) {
    var header_html = item.closest("#itau-header");
    var footer_html = item.closest('footer');
    var section_html = item.closest('section');
    var section_id = '* sin ID';
    if (section_html) {
      section_id = section_html.id;
    } else {
      section_id = "* sin <section>";
    }
    if (header_html || footer_html) {
      if (header_html) {
        console.log(index, 'header | ', section_id, ' | ', item.innerText, ' ', item.href);
      }
      if (footer_html) {
        console.log(index, 'footer | ', section_id, ' | ', item.innerText, ' ', item.href);
      }
    } else {
      console.log(index, 'main | ', section_id, ' | ', item.innerText, ' ', item.href);
    }
  }

  function check_btn(item, index) {
    var header_html = item.closest("#itau-header");
    var footer_html = item.closest("footer");
    var section_html = item.closest("section");
    var section_id = '* sin ID';
    if (section_html) {
      section_id = section_html.id;
    } else {
      section_id = "* sin <section>";
    }
    if (header_html || footer_html) {
      if (header_html) {
        console.log(index, 'header | ', section_id, ' | ', item.innerText);
      }
      if (footer_html) {
        console.log(index, 'footer | ', section_id, ' | ', item.innerText);
      }
    } else {
      console.log(index, 'main | ', section_id, ' | ', item.innerText);
    }
  }



  function check_section(item, index) {
    // dejar como excepción las secciones del header y del footer
    var header_html = item.closest("#itau-header");
    var footer_html = item.closest('footer');
    var section_id = item.id;
    var section_name = section_id;

    if (section_id) {
      // reemplazar por 
      section_name = event_action_section_map(section_id);
      section_name = section_name.replace(/-/g, ' ');
      section_name = section_name.charAt(0).toUpperCase().concat(section_name.slice(1));
    } else { section_without_id = section_without_id + 1; }


    if (header_html || footer_html) {
      if (section_id && header_html) {
        console.log(index, 'header | ', section_id, '-->', section_name);
      }
      if (section_id && footer_html) {
        console.log(index, 'footer  | ', section_id, '-->', section_name);
      }

    } else {
      if (section_id) {
        console.log(index, 'main  | ', section_id, '-->', section_name);
      }

    }
  }


  function check_section_without_id(item, index) {
    var section_id = item.id;

    if (!section_id) {
      console.log(contador, item);
      contador = contador + 1;
    }

  }

  var find_section = document.querySelectorAll('section');
  var find_a = document.querySelectorAll('a');
  var find_b = document.querySelectorAll('button');

  console.log("\n\n Resumen de <section>");
  find_section.forEach(check_section);
  console.log("..... secciones sin ID:", section_without_id);
  console.log("\n\n==> secciones sin ID");
  find_section.forEach(check_section_without_id);
  console.log("\n\n==> Link <a>");
  find_a.forEach(check_a);
  console.log("\n\n==> Botones <button>");
  find_b.forEach(check_btn);

}

