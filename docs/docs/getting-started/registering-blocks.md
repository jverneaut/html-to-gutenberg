# Registering Blocks

If you're using `@wordpress/create-block` to use HTML To Gutenberg, everything is taken care of by the template. Simply activate the plugin, build the block and you're ready to go.

If you integrated HTML To Gutenberg to your theme or an existing webpack configuration, register the generated blocks using:

```php
register_block_type();
```
