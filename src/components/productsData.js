const productsData = [
    // {
    //     "success": true,
    //     "message": "The items are fetched",
    //     "result": [
    //         [
        {
            "product_id": "PROD25",
            "name": "Tomato",
            "description": "Though often classified as a vegetable, the tomato is actually a fruit with a juicy, tangy flavor that’s versatile in both raw and cooked dishes. Tomatoes are rich in lycopene, an antioxidant linked to heart health and reduced cancer risk, particularly prostate cancer. They’re also high in vitamin C, potassium, and folate. The vitamin E in tomatoes also supports skin health, and their high water content makes them hydrating and refreshing.",
            "price": "60.00",
            "stock": 50,
            "category_id": "CAT2",
            "created_at": "2024-11-06T12:16:17.000Z",
            "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730915181/FarmTotable/Users/image-1730915177864-138202814.jpg"
        },
        {
            "product_id": "PROD40",
            "name": "Coriander",
            "description": "Mild and citrusy, bringing a fresh aroma to any dish and often paired with cumin. Adds brightness to dishes without overwhelming flavors. Great for curries, marinades, and seasoning meats, sauces, and veggies.",
            "price": "120.00",
            "stock": 69,
            "category_id": "CAT3",
            "created_at": "2024-11-06T13:47:26.000Z",
            "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730920648/FarmTotable/Users/image-1730920646073-532535721.jpg"
        },   
               
                {
                    "product_id": "PROD16",
                    "name": "Bhindi",
                    "description": "Bhindi is a nutritious vegetable packed with dietary fiber, vitamins C, A, and K, and minerals like potassium and magnesium. Its high fiber content supports digestion, while antioxidants help with immune health. It is also low in calories, making it a healthy addition to various diets.",
                    "price": "30.00",
                    "stock": 20,
                    "category_id": "CAT4",
                    "created_at": "2024-11-06T11:22:41.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730911964/FarmTotable/Users/image-1730911961899-868266888.jpg"
                },
                {
                    "product_id": "PROD17",
                    "name": "Carrot",
                    "description": "Carrots are vibrant orange root vegetables known for their sweet, earthy flavor and crunchy texture. Freshly harvested and rich in beta-carotene, vitamins, and fiber, they make a versatile addition to any kitchen, whether for snacking, juicing, cooking, or adding a nutritious boost to your meals.",
                    "price": "20.00",
                    "stock": 20,
                    "category_id": null,
                    "created_at": "2024-11-06T11:31:08.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730912471/FarmTotable/Users/image-1730912468767-429006809.jpg"
                },
                {
                    "product_id": "PROD23",
                    "name": "BANANA",
                    "description": "Carrots are vibrant orange root vegetables known for their sweet, earthy flavor and crunchy texture. Freshly harvested and rich in beta-carotene, vitamins, and fiber, they make a versatile addition to any kitchen, whether for snacking, juicing, cooking, or adding a nutritious boost to your meals.",
                    "price": "40.00",
                    "stock": 30,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T11:58:38.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730914120/FarmTotable/Users/image-1730914118331-294239824.jpg"
                },
                {
                    "product_id": "PROD24",
                    "name": "Spinach",
                    "description": "Spinach is a leafy green vegetable that’s often used in salads, smoothies, and cooked dishes. Known for its dark green leaves, spinach is loaded with iron, which supports oxygen transport in the blood, and antioxidants like vitamins A and C that help protect cells from damage. It’s also a source of calcium and magnesium, beneficial for bone health, and has anti-inflammatory properties that may reduce the risk of chronic diseases.",
                    "price": "10.00",
                    "stock": 30,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T12:14:02.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730915045/FarmTotable/Users/image-1730915042735-324745593.jpg"
                },
                
                {
                    "product_id": "PROD26",
                    "name": "Broccoli",
                    "description": "Broccoli is a cruciferous vegetable with a unique, slightly bitter taste and a dense, tree-like head. It’s packed with nutrients, including vitamins C and K, which support immune health and bone health, respectively. Broccoli also contains folate, fiber, and various antioxidants that may help reduce inflammation and protect against cancer. Its versatility in cooking, from roasting to steaming, makes it a popular vegetable choice.",
                    "price": "34.00",
                    "stock": 28,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T12:24:38.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730915681/FarmTotable/Users/image-1730915678107-292651486.jpg"
                },
                {
                    "product_id": "PROD27",
                    "name": "Cucumber",
                    "description": "Cucumbers are refreshing, hydrating vegetables with high water content and a mild, crisp taste. They’re low in calories, making them ideal for weight management, and contain small amounts of vitamin K, potassium, and magnesium, which are beneficial for bone and heart health. Cucumbers are often used in salads, smoothies, and pickling. They also contain antioxidants like beta-carotene, which can reduce inflammation and promote skin health.\r\n",
                    "price": "34.00",
                    "stock": 28,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T12:29:01.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730915943/FarmTotable/Users/image-1730915941411-816038220.jpg"
                },
                {
                    "product_id": "PROD28",
                    "name": "Cauliflower",
                    "description": "Cauliflower is a cruciferous vegetable with a mild flavor and versatile use in cooking. It’s low in calories and carbs, making it a popular substitute for grains in dishes like cauliflower rice or pizza crust. Cauliflower is rich in fiber, which aids digestion, and is packed with vitamins C, K, and B6, along with folate. It also contains choline, important for brain health, and glucosinolates, which may support cancer prevention.",
                    "price": "40.00",
                    "stock": 50,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T13:16:13.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730918776/FarmTotable/Users/image-1730918773516-331009603.jpg"
                },
                {
                    "product_id": "PROD29",
                    "name": "Lettuce",
                    "description": "Lettuce is a leafy green commonly used as a base in salads, sandwiches, and wraps. Known for its light, crisp texture, it’s low in calories and provides water, which helps with hydration. Lettuce contains small amounts of vitamins A, K, and C, along with fiber for digestive health. Romaine lettuce, in particular, is richer in nutrients than iceberg varieties, offering folate and beta-carotene, which supports eye health and immunity.",
                    "price": "23.00",
                    "stock": 40,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T13:18:59.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730918941/FarmTotable/Users/image-1730918939135-582186469.jpg"
                },
                {
                    "product_id": "PROD14",
                    "name": "Apple",
                    "description": "Fresh, crisp apples with a sweet-tart flavor, perfect for snacking, baking, or salads. Rich in fiber and essential vitamins.",
                    "price": "80.00",
                    "stock": 5,
                    "category_id": "CAT1",
                    "created_at": "2024-10-25T12:46:22.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1729880183/FarmTotable/Users/image-1729880182065-103222243.jpg"
                },
                {
                    "product_id": "PROD30",
                    "name": "Bell Pepper",
                    "description": "Bell peppers come in a variety of colors, including green, red, yellow, and orange, each with a sweet, mild flavor. They’re rich in vitamins A and C, which are beneficial for skin health and immune function. Red bell peppers, in particular, contain more vitamin C than oranges, making them excellent for supporting collagen production. Bell peppers are also low in calories, making them a nutritious addition to salads, stir-fries, and more.",
                    "price": "54.00",
                    "stock": 60,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T13:20:48.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730919050/FarmTotable/Users/image-1730919048616-518657955.jpg"
                },
                {
                    "product_id": "PROD31",
                    "name": "Onion",
                    "description": "Onions are aromatic vegetables with a pungent flavor when raw and a sweet flavor when cooked. They’re a staple in many cuisines and add depth to dishes. Onions are rich in antioxidants, particularly quercetin, which has anti-inflammatory and heart-protective effects. They also provide fiber and vitamin C, promoting immune health and digestion. Onions contain prebiotics, which feed beneficial gut bacteria and support digestive health.",
                    "price": "69.00",
                    "stock": 78,
                    "category_id": "CAT2",
                    "created_at": "2024-11-06T13:22:34.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730919156/FarmTotable/Users/image-1730919154219-79416516.jpg"
                },
                {
                    "product_id": "PROD32",
                    "name": "Orange",
                    "description": "Oranges are juicy, tangy citrus fruits known for their high vitamin C content, which strengthens the immune system and promotes healthy skin. They also contain fiber, potassium, and folate, supporting heart health and hydration. Oranges are packed with antioxidants like flavonoids, which have anti-inflammatory effects and may reduce the risk of chronic diseases. Often eaten fresh or juiced, oranges are refreshing and energizing.",
                    "price": "40.00",
                    "stock": 30,
                    "category_id": "CAT1",
                    "created_at": "2024-11-06T13:28:15.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730919497/FarmTotable/Users/image-1730919495135-312761023.jpg"
                },
                {
                    "product_id": "PROD33",
                    "name": "Mango",
                    "description": "4. Mangoes are tropical fruits with sweet, juicy flesh and a distinctive flavor. They’re rich in vitamins A and C, which support skin and immune health, and contain fiber that promotes digestion. Mangoes also contain polyphenols and beta-carotene, antioxidants linked to cancer prevention. Often enjoyed fresh, in smoothies, or as dried fruit, mangoes are a nutrient-dense option for a refreshing, tropical flavor.\r\n",
                    "price": "60.00",
                    "stock": 30,
                    "category_id": "CAT1",
                    "created_at": "2024-11-06T13:30:40.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730919643/FarmTotable/Users/image-1730919640646-172046978.jpg"
                },
                {
                    "product_id": "PROD34",
                    "name": "Pineapple",
                    "description": "Pineapples are tropical fruits with a rough, spiky exterior and sweet, juicy flesh. They’re rich in vitamin C, manganese, and bromelain, an enzyme that aids digestion and may reduce inflammation. Pineapples are also hydrating and have antioxidant properties, which support immune health and skin vitality. They’re commonly used in fruit salads, juices, and even savory dishes for a sweet, tangy flavor.",
                    "price": "54.00",
                    "stock": 45,
                    "category_id": "CAT1",
                    "created_at": "2024-11-06T13:32:27.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730919750/FarmTotable/Users/image-1730919747267-378857984.jpg"
                },
                {
                    "product_id": "PROD35",
                    "name": "Strawberry",
                    "description": " Strawberries are vibrant red berries with a juicy, sweet taste and a slightly tangy flavor. They’re packed with vitamin C, manganese, and antioxidants like anthocyanins, which support heart health and reduce inflammation. Strawberries are also a good source of fiber, promoting healthy digestion. They’re popular in desserts, smoothies, and salads, and their low-calorie content makes them a guilt-free, nutritious snack.",
                    "price": "120.00",
                    "stock": 40,
                    "category_id": "CAT1",
                    "created_at": "2024-11-06T13:35:22.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730919924/FarmTotable/Users/image-1730919922116-737332337.jpg"
                },
                
                {
                    "product_id": "PROD15",
                    "name": "Apple",
                    "description": "Fresh, crisp apples with a sweet-tart flavor, perfect for snacking, baking, or salads. Rich in fiber and essential vitamins.",
                    "price": "90.00",
                    "stock": 25,
                    "category_id": "CAT1",
                    "created_at": "2024-10-26T14:36:46.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1729973208/FarmTotable/Users/image-1729973206251-950218656.jpg"
                },
           
                {
                    "product_id": "PROD37",
                    "name": "Watermelon",
                    "description": "Watermelon is a large, refreshing fruit known for its high water content, making it perfect for hydration. It’s low in calories and high in vitamins A and C, as well as antioxidants like lycopene, which may reduce the risk of heart disease and certain cancers. Watermelon is enjoyed fresh, in salads, or as juice, providing a cool and satisfying treat.\r\n",
                    "price": "60.00",
                    "stock": 59,
                    "category_id": "CAT1",
                    "created_at": "2024-11-06T13:38:08.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730920091/FarmTotable/Users/image-1730920088321-277830059.jpg"
                },
                {
                    "product_id": "PROD38",
                    "name": "Kiwi",
                    "description": "Kiwis are small, fuzzy fruits with vibrant green flesh and tiny black seeds. Known for their sweet-tart flavor, kiwis are packed with vitamin C, which boosts immunity and skin health, and fiber that supports digestion. Kiwis are also rich in antioxidants and potassium, promoting heart health. They’re enjoyed fresh, in fruit salads, or as a refreshing addition to smoothies.",
                    "price": "30.00",
                    "stock": 10,
                    "category_id": "CAT1",
                    "created_at": "2024-11-06T13:40:35.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730920237/FarmTotable/Users/image-1730920235119-433752137.jpg"
                },
                {
                    "product_id": "PROD39",
                    "name": "Turmeric",
                    "description": "A vibrant yellow spice with a warm, earthy flavor, known for its anti-inflammatory properties. A staple in Indian cooking and natural remedies. Perfect for curries, rice dishes, and adding color to soups and teas.",
                    "price": "80.00",
                    "stock": 40,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:45:57.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730920560/FarmTotable/Users/image-1730920557510-560731489.jpg"
                },
               
                {
                    "product_id": "PROD41",
                    "name": "Cumin Seed",
                    "description": "Earthy and aromatic with a slightly nutty flavor that enhances global cuisines. Known for its digestion-friendly properties. Ideal for curries, soups, and marinades, enhancing the taste of meats, beans, and vegetables.",
                    "price": "250.00",
                    "stock": 83,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:49:01.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730920744/FarmTotable/Users/image-1730920741711-195873047.jpg"
                },
                {
                    "product_id": "PROD42",
                    "name": "Green Cardamom",
                    "description": "Sweet and floral with hints of citrus, elevating both sweet and savory dishes. Known for its calming properties and aromatic appeal. Perfect for chai, desserts, and rice dishes like biryani.",
                    "price": "180.00",
                    "stock": 71,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:50:55.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730920857/FarmTotable/Users/image-1730920855003-184112142.jpg"
                },
                {
                    "product_id": "PROD43",
                    "name": "Whole cloves",
                    "description": "Intensely aromatic with a warm, sweet-spicy taste that adds depth to recipes. Valued for its strong antiseptic qualities. Commonly used in curries, stews, and holiday baking.",
                    "price": "245.00",
                    "stock": 121,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:52:56.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730920978/FarmTotable/Users/image-1730920976684-136001140.jpg"
                },
                {
                    "product_id": "PROD44",
                    "name": "Cinnamon sticks",
                    "description": "Sweet, warm, and comforting, adding a rich aroma to recipes and evoking cozy memories. Also used for its potential health benefits, especially for blood sugar balance. Ideal for desserts, beverages, curries, and baked goods.",
                    "price": "220.00",
                    "stock": 92,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:54:49.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921092/FarmTotable/Users/image-1730921089804-463105736.jpg"
                },
                {
                    "product_id": "PROD45",
                    "name": "Cinnamon sticks",
                    "description": "Sweet, warm, and comforting, adding a rich aroma to recipes and evoking cozy memories. Also used for its potential health benefits, especially for blood sugar balance. Ideal for desserts, beverages, curries, and baked goods.",
                    "price": "220.00",
                    "stock": 92,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:55:03.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921106/FarmTotable/Users/image-1730921103658-525974968.jpg"
                },
                {
                    "product_id": "PROD46",
                    "name": "Black Peppercorns",
                    "description": "Sharp and spicy, a must-have spice in any pantry for its versatile and bold flavor. Adds warmth and a slight heat to any dish. Great for marinades, rubs, or grinding fresh over dishes.",
                    "price": "43.00",
                    "stock": 540,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:56:43.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921205/FarmTotable/Users/image-1730921203265-37542698.jpg"
                },
                {
                    "product_id": "PROD47",
                    "name": "Fenugreek Seeds",
                    "description": "Nutty and slightly bitter, adding a unique twist to meals with its maple-like scent. Known for promoting digestion and metabolism. Perfect for curries, pickles, and enhancing stews and sauces.",
                    "price": "72.00",
                    "stock": 450,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T13:58:31.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921314/FarmTotable/Users/image-1730921311478-783097777.jpg"
                },
                {
                    "product_id": "PROD48",
                    "name": "Mustard Seeds",
                    "description": "Sharp, tangy, and full of flavor, adding a zing to recipes with a punch. Used widely in tempering and pickling. Excellent for Indian curries, pickling, and sauces.",
                    "price": "180.00",
                    "stock": 90,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T14:00:02.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921404/FarmTotable/Users/image-1730921402502-816977390.jpg"
                },
                {
                    "product_id": "PROD49",
                    "name": "Nutmeg",
                    "description": "Warm and slightly sweet, nutmeg brings a cozy and aromatic depth to both sweet and savory recipes. Known for its calming and digestive properties. Ideal for desserts, sauces, and pasta.",
                    "price": "210.00",
                    "stock": 20,
                    "category_id": "CAT3",
                    "created_at": "2024-11-06T14:01:03.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921466/FarmTotable/Users/image-1730921463535-134469537.jpg"
                },
                {
                    "product_id": "PROD50",
                    "name": "Yogurt",
                    "description": "Creamy and tangy, yogurt is rich in probiotics and calcium, supporting digestion and overall health. Perfect as a snack, in smoothies, or as a base for dressings and dips.",
                    "price": "80.00",
                    "stock": 59,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:04:43.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921686/FarmTotable/Users/image-1730921683756-69224582.jpg"
                },
                {
                    "product_id": "PROD51",
                    "name": "Cheddar cheese",
                    "description": "Sharp and flavorful, cheddar cheese is a crowd-pleaser packed with protein and calcium. Great for sandwiches, salads, and adding a savory touch to baked dishes.",
                    "price": "120.00",
                    "stock": 38,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:05:48.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921751/FarmTotable/Users/image-1730921748484-629908392.jpg"
                },
                {
                    "product_id": "PROD52",
                    "name": "butter",
                    "description": "Smooth and creamy, butter brings rich flavor and moisture to cooking and baking. Essential for spreading on bread, sautéing, and adding depth to sauces and desserts.",
                    "price": "430.00",
                    "stock": 23,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:06:45.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921807/FarmTotable/Users/image-1730921805021-112186274.jpg"
                },
                {
                    "product_id": "PROD53",
                    "name": "cream cheese",
                    "description": "Soft and tangy, cream cheese adds a smooth texture and flavor to recipes. Perfect for spreading on bagels, making cheesecakes, and adding creaminess to sauces.",
                    "price": "140.00",
                    "stock": 30,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:08:17.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921900/FarmTotable/Users/image-1730921897899-677284964.jpg"
                },
                {
                    "product_id": "PROD54",
                    "name": "Ghee",
                    "description": "Clarified butter with a rich, nutty flavor, known for its high smoke point and health benefits. Great for frying, sautéing, and traditional Indian cooking, enhancing the taste of curries and breads.",
                    "price": "600.00",
                    "stock": 25,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:09:34.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730921976/FarmTotable/Users/image-1730921974586-980273163.jpg"
                },
                {
                    "product_id": "PROD55",
                    "name": "Butter milk",
                    "description": "Tangy and light, buttermilk is great for baking, giving a tender texture to cakes and pancakes. Perfect for marinades and adding creaminess to dressings.",
                    "price": "120.00",
                    "stock": 34,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:12:01.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730922123/FarmTotable/Users/image-1730922121075-978896698.jpg"
                },
                {
                    "product_id": "PROD56",
                    "name": "Skyr",
                    "description": "Thick and creamy Icelandic dairy, similar to yogurt, but higher in protein and lower in sugar. Ideal for breakfast, smoothies, or as a healthy snack.",
                    "price": "240.00",
                    "stock": 24,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:13:14.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730922197/FarmTotable/Users/image-1730922194545-57507403.jpg"
                },
                {
                    "product_id": "PROD57",
                    "name": "Pappad",
                    "description": "Crispy and savory, papad (or pappadum) is a thin, spiced wafer made from lentils or rice flour. Great as a side with meals, an appetizer, or a snack on its own. Adds a delightful crunch to every bite.",
                    "price": "30.00",
                    "stock": 120,
                    "category_id": "CAT5",
                    "created_at": "2024-11-06T14:15:37.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730922339/FarmTotable/Users/image-1730922337494-846678278.jpg"
                },
                {
                    "product_id": "PROD58",
                    "name": "Almonds",
                    "description": "Crunchy and nutrient-rich almonds, packed with healthy fats, protein, and fiber, making them a perfect snack for energy and heart health. Use them as a topping for desserts or enjoy as a wholesome snack.",
                    "price": "800.00",
                    "stock": 20,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T04:56:14.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975178/FarmTotable/Users/image-1730975174329-35213509.jpg"
                },
                {
                    "product_id": "PROD59",
                    "name": "Cashews",
                    "description": "Creamy and delicious cashews, full of essential minerals and vitamins, ideal for snacking or adding to savory and sweet dishes. Perfect for making nut-based sauces and adding richness to recipes.",
                    "price": "650.00",
                    "stock": 22,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T04:57:22.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975245/FarmTotable/Users/image-1730975242802-802176696.jpg"
                },
                {
                    "product_id": "PROD60",
                    "name": "Raisins",
                    "description": "Naturally sweet and chewy raisins, rich in iron and antioxidants, making them a great addition to cereals, desserts, or as a healthy snack on the go.\r\n\r\n",
                    "price": "600.00",
                    "stock": 30,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T04:58:34.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975317/FarmTotable/Users/image-1730975314284-710851365.jpg"
                },
                {
                    "product_id": "PROD61",
                    "name": "Walnuts",
                    "description": "Heart-healthy walnuts, loaded with omega-3 fatty acids and antioxidants, perfect for adding a crunchy texture to salads, baked goods, or enjoying as a nutritious snack.",
                    "price": "700.00",
                    "stock": 25,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T04:59:41.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975384/FarmTotable/Users/image-1730975381796-286035918.jpg"
                },
                {
                    "product_id": "PROD62",
                    "name": "Pistachios",
                    "description": "Crunchy and flavorful pistachios, full of antioxidants and protein, ideal for snacking or adding to ice creams and baked goods for a rich taste. Enjoy them roasted or add to desserts for a pop of flavor.",
                    "price": "750.00",
                    "stock": 23,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T05:00:50.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975454/FarmTotable/Users/image-1730975450674-802592420.jpg"
                },
                {
                    "product_id": "PROD63",
                    "name": "Honey",
                    "description": "Pure and golden honey, naturally sweet and rich in antioxidants, perfect for adding natural sweetness to teas, desserts, or breakfast dishes. Use as a healthy alternative to refined sugar, or drizzle over yogurt and fruits for a delicious treat.",
                    "price": "450.00",
                    "stock": 28,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T05:02:30.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975554/FarmTotable/Users/image-1730975550950-826836031.jpg"
                },
                {
                    "product_id": "PROD64",
                    "name": "Herbal teas",
                    "description": "Soothing and aromatic herbal teas crafted from natural herbs, flowers, and spices, offering a range of flavors and wellness benefits. Perfect for relaxation, digestion, or boosting energy, these teas can be enjoyed hot or iced for a refreshing experience.",
                    "price": "230.00",
                    "stock": 32,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T05:04:20.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975663/FarmTotable/Users/image-1730975660099-438172273.jpg"
                },
                {
                    "product_id": "PROD65",
                    "name": "Jaggery",
                    "description": "Unrefined, natural sweetener made from sugarcane or palm sap, retaining all the goodness of minerals and antioxidants. Use as a healthier alternative to refined sugar in desserts and beverages.",
                    "price": "70.00",
                    "stock": 53,
                    "category_id": "CAT6",
                    "created_at": "2024-11-07T05:05:53.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730975756/FarmTotable/Users/image-1730975753437-847981868.jpg"
                },
                {
                    "product_id": "PROD66",
                    "name": "Moringa Powder",
                    "description": "Nutrient-rich moringa powder, harvested from moringa trees grown on eco-friendly farms. Perfect for adding to smoothies, soups, or energy balls for a boost of vitamins and minerals.",
                    "price": "30.00",
                    "stock": 53,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:16:00.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730976363/FarmTotable/Users/image-1730976360764-804851342.jpg"
                },
                {
                    "product_id": "PROD67",
                    "name": "Amla",
                    "description": "Vitamin C-rich amla pieces, sun-dried and preserved naturally by farmers. Great for boosting immunity and adding a tangy flavor to snacks or traditional dishes.",
                    "price": "50.00",
                    "stock": 93,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:17:00.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730976422/FarmTotable/Users/image-1730976420193-453718708.jpg"
                },
                {
                    "product_id": "PROD68",
                    "name": "Aloevera",
                    "description": "Freshly extracted aloe vera gel from aloe plants nurtured by farmers. A multipurpose gel for skincare, hair care, or as a soothing remedy for minor burns and skin irritations.",
                    "price": "80.00",
                    "stock": 34,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:18:32.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730976514/FarmTotable/Users/image-1730976512032-321757186.jpg"
                },
                {
                    "product_id": "PROD69",
                    "name": "Black Rice",
                    "description": "Nutritious black rice, cultivated using sustainable practices. Known for its high antioxidant content and nutty flavor, perfect for health-conscious recipes like rice bowls and salads.",
                    "price": "120.00",
                    "stock": 29,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:19:30.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730976572/FarmTotable/Users/image-1730976570586-907251454.jpg"
                },
                {
                    "product_id": "PROD70",
                    "name": "Homemade Jam",
                    "description": "Delicious, all-natural homemade jams made from fresh, hand-picked fruits with no added preservatives. Spread on toast, mix into yogurt, or enjoy as a sweet topping for your desserts.",
                    "price": "90.00",
                    "stock": 41,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:20:43.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730976645/FarmTotable/Users/image-1730976643255-509089019.jpg"
                },
                {
                    "product_id": "PROD71",
                    "name": "Nut clusters",
                    "description": "Delicious, all-natural homemade jams made from fresh, hand-picked fruits with no added preservatives. Spread on toast, mix into yogurt, or enjoy as a sweet topping for your desserts.",
                    "price": "90.00",
                    "stock": 41,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:24:14.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730976857/FarmTotable/Users/image-1730976854778-462138547.jpg"
                },
                {
                    "product_id": "PROD72",
                    "name": "Nut clusters",
                    "description": "A blend of dry fruits, seeds, and nuts held together with honey or jaggery. Flavors may include spiced almond clusters, cocoa hazelnut bites, or tropical coconut clusters for a healthy, energy-boosting snack.",
                    "price": "90.00",
                    "stock": 41,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:24:37.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730976880/FarmTotable/Users/image-1730976877793-125207404.jpg"
                },
                {
                    "product_id": "PROD73",
                    "name": "Pickled Gourmet Vegetables",
                    "description": "Farm-fresh vegetables pickled with unique flavors, like spicy pickled carrots or curried cauliflower. These are ideal for adding a gourmet twist to sandwiches or serving on a charcuterie board.",
                    "price": "210.00",
                    "stock": 54,
                    "category_id": "CAT4",
                    "created_at": "2024-11-07T05:26:44.000Z",
                    "prodImage": "http://res.cloudinary.com/dlc7tsojn/image/upload/v1730977007/FarmTotable/Users/image-1730977004719-831721247.jpg"
                }
//             ]
// ]
//     }
];

export default productsData;