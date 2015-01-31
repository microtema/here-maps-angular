# &lt;here-maps&gt;
Web Component for Nokia HERE Maps using Angular

## Install

You can install this package with bower

```
    $ bower install here-maps-angular --save
```

## Usage

1. Import Web Components' here-maps-angular:

	```
	<script src="bower_components/here-maps-angular.js"></script>
	```

2. Import Custom CSS:

	```
	<link type="text/css" rel="stylesheet" href="/css/here-maps-angular.css" >
	```

3. Start using it!

	```
	<here-maps data-app-token='{"App_Id":"xxx", "App_Code": "xxx"}' zoom-level="10" >
	```

	[{"street":"Gottesauerstr.18", "city" : "Karlsruhe", "zip":"76131"}]

	```
	</here-maps>
	```

## Documentation

## Options

+-----------------+-------------+----------+---------------------------------------+
| Attribute       | Type        | Default  | Description                           |
+-----------------+-------------+----------+---------------------------------------+
| data-app-token  | JSON        | not null | App_Id, App_Code                      |
+-----------------+-------------+----------+---------------------------------------+
| data-zoom-level | number      | null     | Set zoom level on Groups (default:10) |
+-----------------+-------------+----------+---------------------------------------+
| body            | Array<JSON> | not null | List of Places                        |
+-----------------+-------------+----------+---------------------------------------+

## Place Properties

+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| Attribute | Type   | Default  | Description                                                                                                                                       |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| name      | String | not null | Place name                                                                                                                                        |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| street    | String | null     | Street of Place                                                                                                                                   |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| zip       | String | not null | ZIP Code                                                                                                                                          |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| city      | String | not null | City Name                                                                                                                                         |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| lat       | Double | null     | A Geographic coordinate that specifies the height of a point in meters.                                                                           |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| lng       | Double | null     | A Geographic coordinate that specifies the east-west position of a point,on the Earth's surface in the range from -180 to 180 degrees,,inclusive. |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+
| zoom      | Number | null     | The zoom level on the map. Every zoom level represents different scale i.e map at zoom level 2 is twice as large as the map at zoom level 1       |
+-----------+--------+----------+---------------------------------------------------------------------------------------------------------------------------------------------------+

## NOTE

* if a Geographic coordinate is not present it will be resolved from address on the fly.
* If a Address is not present it will be resolved from coordinate on the fly
* if places contains only one Place, the zoom will the data-zoom-level if given on directive else 10

## License

Dual licensed under MIT

Copyright © 2015 sefenfate 7fate@web.de

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
