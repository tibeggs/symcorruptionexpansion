// your-script.js
Hooks.on('init', () => {
  function _corruptionExpression(itemData, level = itemData.system.level) {
    console.log("Intercepted Corruptions")
    /* get default expression */
    let expression = itemData.type === 'spell' ? Spellcasting._generateCorruptionExpression(level, Spellcasting._isFavored(itemData)) : '0';
    let type = 'temp'

    /* has custom corruption? */
    const custom = getProperty(itemData, game.syb5e.CONFIG.PATHS.corruptionOverride.root) ?? duplicate(game.syb5e.CONFIG.DEFAULT_ITEM.corruptionOverride);

    /* modify the expression (always round up) minimum 1 unless custom */
    if(custom.mode !== game.syb5e.CONFIG.DEFAULT_ITEM.corruptionOverride.mode){
      //has override
      switch (custom.mode) {
        case CONST.ACTIVE_EFFECT_MODES.ADD:
          expression = `${expression} + (${custom.value})`
          break;
        case CONST.ACTIVE_EFFECT_MODES.MULTIPLY:
          expression = `(${expression}) * (${custom.value})`
          break;
        case CONST.ACTIVE_EFFECT_MODES.OVERRIDE:
          expression = custom.value;
          break;
      }
    }

    /* modify the target */
    if (custom.type !== game.syb5e.CONFIG.DEFAULT_ITEM.corruptionOverride.type) {
      type = custom.type
    }

    /* after all modifications have been done, return the final expression */
    return {expression, type};
  }
});

Hooks.on('ready', () => {
    Hooks.on('readysymbaroum5ecore', (module, data, options, userId) => {
      if (module === 'Spellcasting' && data._id === 'someId') {
        // Replace the original function with your custom function
        CONFIG.SYMB5E.Spellcasting._corruptionExpression = _corruptionFunction;
      }
    });
  });

  